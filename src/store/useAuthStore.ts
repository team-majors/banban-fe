import { create } from "zustand";
import { apiFetch } from "@/lib/apiFetch";
import { getToken } from "@/remote/auth";
import { UserInfoResponse } from "@/types/api";
import { TokenRequestResponse, User } from "@/types/auth";
import { clearTokens, saveAccessToken } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import STORAGE_KEYS from "@/constants/storageKeys";
import { logger } from "@/utils/logger";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  login: (params: {
    code: string;
    provider: "kakao" | "naver";
    state?: string;
  }) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,
  error: null,

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const { data }: UserInfoResponse = await apiFetch("/users/profile");
      set({ user: data, isLoggedIn: true, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ user: null, isLoggedIn: false, loading: false });
    }
  },

  refreshToken: async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        logger.error("토큰 갱신 요청 실패", {
          status: res.status,
          statusText: res.statusText,
        });
        return false;
      }

      const data: TokenRequestResponse = await res.json();
      saveAccessToken(data.data.access_token);

      // 토큰 갱신 후 사용자 정보 다시 가져오기
      await get().checkAuth();

      logger.info("토큰 갱신 및 사용자 상태 업데이트 성공");
      return true;
    } catch (error) {
      logger.error("토큰 갱신 중 예외 발생", error);
      // 토큰 갱신 실패시 로그아웃 처리
      get().logout();
      return false;
    }
  },

  login: async ({ code, provider, state }) => {
    set({ loading: true, error: null });

    const deviceId = uuidv4();
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);

    try {
      const { response, data } = await getToken({ code, provider, state });

      if (response.ok) {
        saveAccessToken(data.data.access_token);
        await get().checkAuth();
        return true;
      }

      let errorMessage = "로그인 처리 중 문제가 발생했습니다.";
      switch (response.status) {
        case 404:
          sessionStorage.setItem(STORAGE_KEYS.OAUTH_DATA, JSON.stringify(data));
          // This case should be handled by redirecting to signup page, not by setting an error.
          errorMessage = "회원가입이 필요합니다.";
          break;
        case 409:
          errorMessage = "다른 플랫폼으로 가입된 계정입니다.";
          break;
        case 401:
          errorMessage = "인증 토큰이 유효하지 않습니다.";
          break;
        case 500:
          errorMessage = "서버 오류가 발생했습니다.";
          break;
      }
      throw new Error(errorMessage);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    clearTokens();
    set({ user: null, isLoggedIn: false, error: null });
  },
}));
