import { create } from "zustand";
import { ApiError, apiFetch } from "@/lib/apiFetch";
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
  checkAuth: (options?: { silent?: boolean }) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,
  error: null,

  checkAuth: async (options) => {
    const silent = options?.silent ?? false;

    if (!silent) {
      set({ loading: true, error: null });
    } else {
      set({ error: null });
    }

    // 토큰이 있는 경우에만 프로필 API 호출
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null;

    if (!token) {
      logger.info("비로그인 상태 - 인증 체크 생략");
      set(() => ({
        user: null,
        isLoggedIn: false,
        ...(silent ? {} : { loading: false }),
        error: null,
      }));
      return;
    }

    try {
      const { data }: UserInfoResponse = await apiFetch("/users/profile");
      set({ user: data, isLoggedIn: true, loading: false });
    } catch (error) {
      logger.warn("인증 체크 실패", error);

      const status = error instanceof ApiError ? error.status : undefined;
      const message =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";

      if (silent) {
        throw error instanceof Error ? error : new Error(message);
      }

      const tokenExists =
        typeof window !== "undefined" &&
        !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (tokenExists && status && [401, 403].includes(status)) {
        const refreshed = await get().refreshToken();
        if (refreshed) {
          set({ loading: false, error: null });
          return;
        }
      }

      if (status && [401, 403].includes(status)) {
        if (typeof window !== "undefined") {
          clearTokens();
        }
        set({
          user: null,
          isLoggedIn: false,
          loading: false,
          error: null,
        });
        return;
      }

      set({
        loading: false,
        error: message,
      });
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

      let data: TokenRequestResponse | null = null;
      if (res.status !== 204) {
        try {
          const bodyText = await res.text();
          if (bodyText) {
            data = JSON.parse(bodyText) as TokenRequestResponse;
          }
        } catch (error) {
          logger.warn("토큰 갱신 응답 파싱 실패", error);
          return false;
        }
      }

      const accessToken = data?.data?.access_token;
      if (accessToken) {
        saveAccessToken(accessToken);
      }

      // 토큰 갱신 후 사용자 정보 다시 가져오기
      await get().checkAuth({ silent: true });

      logger.info("토큰 갱신 및 사용자 상태 업데이트 성공");
      return true;
    } catch (error) {
      logger.error("토큰 갱신 중 예외 발생", error);
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

  logout: async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      logger.warn("서버 로그아웃 실패", e);
    } finally {
      clearTokens();
      set({ user: null, isLoggedIn: false, error: null });
      // ✅ 모든 상태를 완전히 초기화하기 위해 홈으로 강제 리다이렉트
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },
}));
