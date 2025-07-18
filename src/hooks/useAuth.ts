import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { APIResponse } from "@/types/api";
import { LoginRequest, LoginResponse, User } from "@/types/auth";

interface UseAuthReturn {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const response: APIResponse<User> = await apiFetch<User>("/auth/me");
      const authUser = response.data;
      setUser(authUser);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setUser(null);
      // 인증 체크 실패는 에러로 처리하지 않음 (로그인되지 않은 상태일 수 있음)
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setError(null);
      setLoading(true);

      try {
        const loginData: LoginRequest = { email, password };
        const res = await apiFetch<LoginResponse>(`/auth/login`, {
          method: "POST",
          body: JSON.stringify(loginData),
        });
        const data = res.data;

        if (!data.accessToken || !data.refreshToken) {
          throw new Error("토큰이 응답에 포함되지 않았습니다.");
        }

        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);

        await checkAuth();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.",
        );
        throw err; // 상위 호출자에 에러 전달 (필요 없다면 제거 가능)
      } finally {
        setLoading(false);
      }
    },
    [checkAuth],
  );

  const logout = useCallback((): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } catch (err) {
        console.error("localStorage 접근 에러:", err);
      }
    }

    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    loading,
    error,
  };
}
