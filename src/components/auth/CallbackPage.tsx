"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/common/Toast/useToast";
import styled, { keyframes } from "styled-components";
import useAuth from "@/hooks/auth/useAuth";

interface CallbackPageProps {
  provider: "kakao" | "naver";
}

export default function CallbackPage({ provider }: CallbackPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const { code, state } = useMemo(() => {
    return {
      code: searchParams?.get("code") ?? null,
      state: searchParams?.get("state") ?? undefined,
    };
  }, [searchParams]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 비동기 처리 중단
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!code) {
      setError("URL에서 인증 코드를 찾을 수 없습니다.");
      return;
    }

    const doLogin = async () => {
      try {
        await login({ code, provider, state });
        if (!isMounted.current) return;
        router.replace("/");
      } catch (err) {
        if (!isMounted.current) return;
        console.error("로그인 실패:", err);
        setError("로그인 요청에 실패했습니다.");

        showToast({
          type: "error",
          message: `로그인 실패: ${(err as Error).message}`,
          duration: 1500,
        });
      }
    };

    void doLogin();
  }, [code, provider, state, login, router, showToast]);

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
  padding: 24px;
  z-index: 999;
`;

const StatusCard = styled.div`
  max-width: 320px;
  width: 100%;
  border-radius: 16px;
  padding: 28px 24px;

  background: #3a21b7a0;
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 40px rgba(15, 4, 60, 0.25);
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
