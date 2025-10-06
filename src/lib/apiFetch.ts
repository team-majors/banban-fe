import { useAuthStore } from "@/store/useAuthStore";
import STORAGE_KEYS from "@/constants/storageKeys";
import { extractErrorMessage } from "@/utils/errorMessages";
import { logger } from "@/utils/logger";
import { ApiContext } from "@/types/api";
import camelcaseKeys from "camelcase-keys";

let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  retry = true,
  context?: ApiContext,
): Promise<T> {
  const startTime = Date.now();

  // 진행 중인 리프레시가 있으면 기다림
  if (refreshPromise) {
    logger.info("Waiting for ongoing token refresh...", { url });
    const success = await refreshPromise;
    if (!success) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  const token = getAccessToken();

  logger.debug("API 요청 시작", {
    url,
    method: options.method || "GET",
    hasToken: !!token,
    headers: options.headers,
    context,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const duration = Date.now() - startTime;

  if (res.ok) {
    logger.info("API 요청 성공", {
      url,
      status: res.status,
      duration: `${duration}ms`,
      context,
    });

    const data = await res.json();
    return camelcaseKeys(data, { deep: true }) as T;
  }

  // 401 처리
  if (res.status === 401 && retry) {
    logger.warn("액세스 토큰 만료 감지", { url, duration: `${duration}ms` });

    // 토큰이 없거나, /users/profile 요청인 경우 리프레시 시도하지 않음
    if (!token || url === "/users/profile") {
      logger.warn("비로그인 상태 또는 프로필 조회 실패 - 리프레시 불필요", { url, hasToken: !!token });
      throw new Error("로그인이 필요합니다.");
    }

    // refreshPromise가 없으면 새로 생성
    if (!refreshPromise) {
      logger.info("토큰 갱신 시작");
      refreshPromise = useAuthStore
        .getState()
        .refreshToken()
        .finally(() => {
          refreshPromise = null;
        });
    }

    const success = await refreshPromise;

    if (!success) {
      logger.error("토큰 갱신 실패, 로그아웃 처리", { url });
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    logger.info("토큰 갱신 성공, 원래 요청 재시도", { url });
    // retry true로 유지하여 원래 요청이 반드시 재시도되도록 함
    return apiFetch<T>(url, options, false, context);
  }

  // 에러 처리
  let errorMessage = "";
  try {
    const errorBody = await res.json();
    errorMessage =
      extractErrorMessage(errorBody, res.status, context) || errorBody.message;
    logger.error("API 요청 실패", {
      url,
      status: res.status,
      duration: `${duration}ms`,
      errorBody,
      context,
    });
  } catch {
    const errorText = await res.text();
    errorMessage = errorText || `HTTP ${res.status}`;
    logger.error("API 요청 실패 - 응답 파싱 불가", {
      url,
      status: res.status,
      duration: `${duration}ms`,
      errorText,
      context,
    });
  }

  throw new Error(errorMessage);
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  logger.debug("액세스 토큰 조회", { hasToken: !!token });
  return token;
}

function isUserLoggedIn(): boolean {
  return (
    typeof window !== "undefined" &&
    !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  );
}
