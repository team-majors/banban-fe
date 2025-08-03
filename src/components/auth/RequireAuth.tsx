"use client";

import { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireAuth({ children, fallback }: Props) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) {
    return fallback || <p>로그인이 필요합니다.</p>;
  }

  return <>{children}</>;
}
