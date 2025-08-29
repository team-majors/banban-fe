"use client";

import { useState, useEffect, memo } from "react";
import styled, { keyframes } from "styled-components";
import { Avatar } from "../Avatar/Avatar";

interface TargetUser {
  nickname: string;
  description: string;
  avatarUrl: string;
  highlightText?: string;
}

interface UserInfoLoaderProps {
  userId: string | number;
  onUserLoaded: (user: TargetUser) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
}

// 스켈레톤 애니메이션
const skeletonShimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
`;

const SkeletonAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${skeletonShimmer} 1.5s infinite;
`;

const SkeletonText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SkeletonLine = styled.div<{ width: string; height: string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${skeletonShimmer} 1.5s infinite;
  border-radius: 4px;
`;

export const UserInfoLoader = memo(({
  userId,
  onUserLoaded,
  onError,
  children,
}: UserInfoLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: 실제 API 엔드포인트로 교체
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const userData = await response.json();

        // API 응답을 TargetUser 인터페이스에 맞게 변환
        const user: TargetUser = {
          nickname: userData.nickname,
          description: userData.description || userData.bio || "",
          avatarUrl: userData.avatarUrl || userData.profileImage || "",
          highlightText: userData.highlightText,
        };

        onUserLoaded(user);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId, onUserLoaded, onError]);

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <SkeletonContainer>
        <SkeletonAvatar />
        <SkeletonText>
          <SkeletonLine width="80px" height="16px" />
          <SkeletonLine width="120px" height="14px" />
        </SkeletonText>
      </SkeletonContainer>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px" }}>
        <Avatar
          src=""
          alt="에러"
          size={48}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#ef4444" }}>
            유저 정보를 불러올 수 없습니다
          </span>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {error.message}
          </span>
        </div>
      </div>
    );
  }

  // 성공 시 children 렌더링
  return <>{children}</>;
});

UserInfoLoader.displayName = 'UserInfoLoader';
