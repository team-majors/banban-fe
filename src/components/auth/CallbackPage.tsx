"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/common/Toast/useToast";
import { Spinner } from "@/components/svg/Spinner";
import styled from "styled-components";
import useAuth from "@/hooks/useAuth";

export default function CallbackPage({
  provider,
}: {
  provider: "kakao" | "naver";
}) {
  const { showToast } = useToast();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [authCode, setAuthCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1 URL에서 인증 코드 추출
  useEffect(() => {
    extractAuthCodeFromUrl();
  }, []);

  // 2 인증 후 응답 처리
  useEffect(() => {
    if (authCode !== "") {
      handleLogin(authCode);
    }
  }, [authCode]);

  const extractAuthCodeFromUrl = () => {
    const code = searchParams?.get("code");

    if (!code) {
      setError("URL에서 인증 코드를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }
    setAuthCode(code);
  };

  const handleLogin = async (code: string) => {
    const state = searchParams?.get("state") || undefined;
    try {
      await login({
        code,
        provider,
        state,
      });
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("로그인 요청에 실패했습니다.");
      showToast({
        type: "error",
        message: "로그인 처리 실패: " + (err as Error).message,
        duration: 1000,
      });
    } finally {
      setIsLoading(false);
      router.replace("/");
    }
  };

  if (isLoading) {
    return <div className="text-base-white text-center pt-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-base-white text-center pt-5">Error: {error}</div>
    );
  }

  return (
    <Container>
      <Spinner />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
