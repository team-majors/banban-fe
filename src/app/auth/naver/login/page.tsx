"use client";
import CallbackPage from "@/components/auth/CallbackPage";
import { Spinner } from "@/components/svg/Spinner";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackPage provider="naver" />
    </Suspense>
  );
}
