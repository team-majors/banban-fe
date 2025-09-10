"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthManager() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, []);

  return null;
}
