import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, login, logout, loading, error, checkAuth } =
    useAuthStore();

  useEffect(() => {
    if (error === "회원가입이 필요합니다." && pathname !== "/login") {
      router.push("/login");
    }
  }, [error, router, pathname]);

  return {
    user,
    isLoggedIn,
    login,
    logout,
    loading,
    error,
    checkAuth,
  };
}
