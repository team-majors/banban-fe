import { useAuthStore } from "@/store/useAuthStore";
import STORAGE_KEYS from "@/constants/storageKeys";
import { TokenRequestResponse } from "@/types/auth";
import { extractErrorMessage } from "@/utils/errorMessages";
import { logger } from "@/utils/logger";
import { saveAccessToken } from "@/utils/storage";
import { ApiContext } from "@/types/api";

let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  retry = true,
  context?: ApiContext,
): Promise<T> {
  const startTime = Date.now();

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
    return res.json();
  }

  if (res.status === 401 && retry) {
    logger.warn("액세스 토큰 만료 감지", { url, duration: `${duration}ms` });

    if (!isUserLoggedIn()) {
      logger.warn("Access Token 없음 - 갱신 불가", { url });
      throw new Error("로그인이 필요합니다.");
    }

    if (!refreshPromise) {
      logger.info("토큰 갱신 시작");
      refreshPromise = tryRefreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const success = await refreshPromise;

    if (success) {
      logger.info("토큰 갱신 성공, 요청 재시도", { url });
      return apiFetch<T>(url, options, false, context);
    } else {
      logger.error("토큰 갱신 실패, 로그아웃 처리", { url });
      useAuthStore.getState().logout();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

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

async function tryRefreshToken(): Promise<boolean> {
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

    logger.info("토큰 갱신 성공");
    return true;
  } catch (error) {
    logger.error("토큰 갱신 중 예외 발생", error);
    return false;
  }
}

function isUserLoggedIn(): boolean {
  return (
    typeof window !== "undefined" &&
    !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  );
}
