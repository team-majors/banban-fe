"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/common/Toast/useToast";
import styled, { keyframes } from "styled-components";
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const code = searchParams?.get("code");

    if (!code) {
      setError("URL에서 인증 코드를 찾을 수 없습니다.");
      return;
    }

    setAuthCode(code);
  }, [searchParams]);

  useEffect(() => {
    if (!authCode) return;

    let isActive = true;

    const performLogin = async () => {
      const state = searchParams?.get("state") || undefined;
      try {
        await login({
          code: authCode,
          provider,
          state,
        });
      } catch (err) {
        console.error("로그인 실패:", err);
        if (!isActive) return;
        setError("로그인 요청에 실패했습니다.");
        showToast({
          type: "error",
          message: "로그인 처리 실패: " + (err as Error).message,
          duration: 1000,
        });
      } finally {
        if (!isActive) return;
        router.replace("/");
      }
    };

    void performLogin();

    return () => {
      isActive = false;
    };
  }, [authCode, login, provider, router, searchParams, showToast]);

  if (error) {
    return (
      <Container>
        <StatusCard role="alert">
          <StatusTitle>로그인에 실패했어요</StatusTitle>
          <StatusDescription>{error}</StatusDescription>
        </StatusCard>
      </Container>
    );
  }

  return (
    <Container>
      <StatusCard>
        <StatusTitle>로그인 처리 중이에요</StatusTitle>
        <StatusDescription>
          잠시만 기다려 주세요. 곧 홈으로 이동합니다.
        </StatusDescription>
        <LoadingDots aria-hidden="true">
          <Dot />
          <Dot />
          <Dot />
        </LoadingDots>
      </StatusCard>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #100d1f;
  padding: 24px;
`;

const StatusCard = styled.div`
  max-width: 320px;
  width: 100%;
  border-radius: 16px;
  padding: 28px 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 40px rgba(63, 19, 255, 0.25);
  text-align: center;
  color: #ffffff;
`;

const StatusTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const StatusDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

const LoadingDots = styled.div`
  display: inline-flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff05ce 0%, #3f13ff 100%);
  animation: ${bounce} 1.2s infinite ease-in-out;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
