"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import STORAGE_KEYS from "@/constants/storageKeys";

export default function AuthManager() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [checkAuth]);

  const lastCheckRef = useRef(0);
  const checkingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldSkip = () => {
      if (!isLoggedIn) return true;
      if (checkingRef.current) return true;

      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return true;

      const now = Date.now();
      const elapsed = now - lastCheckRef.current;
      const MIN_INTERVAL = 1000 * 60; // 최소 1분 간격

      if (elapsed < MIN_INTERVAL) {
        return true;
      }

      lastCheckRef.current = now;
      return false;
    };

    const runSilentCheck = () => {
      if (shouldSkip()) return;

      checkingRef.current = true;
      checkAuth({ silent: true })
        .catch(() => {
          // silent 모드 실패는 별도 알림 없이 무시
        })
        .finally(() => {
          checkingRef.current = false;
        });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        runSilentCheck();
      }
    };

    const handleFocus = () => {
      runSilentCheck();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuth, isLoggedIn]);

  return null;
}
