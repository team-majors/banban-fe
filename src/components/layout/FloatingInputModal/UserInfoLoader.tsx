import { memo, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Avatar } from "../../common/Avatar/Avatar";
import { useUserVoteInfo } from "@/hooks/useUserVoteInfo";

interface TargetUser {
  nickname: string;
  description: string;
  avatarUrl: string;
  highlightText?: string;
  voteTextColor?: string;
}

interface UserInfoLoaderProps {
  onUserLoaded: (user: TargetUser) => void;
  onError?: (error: Error) => void;
}

export const UserInfoLoader = memo(({
  onUserLoaded,
  onError,
}: UserInfoLoaderProps) => {
  // useUserVoteInfo 훅을 사용하여 유저 정보와 투표 정보 가져오기
  const {
    data: userVoteInfo,
    isLoading,
    error,
    hasVoted,
    votedOptionContent,
    userAvatar,
    username
  } = useUserVoteInfo();

  // 투표 옵션에 따른 색상 결정 함수
  const getVoteTextColor = (optionContent: string | null) => {
    if (!optionContent) return '#6b7280'; // 기본 회색

    // 투표 옵션 내용에 따라 색상 결정
    // 예시: 옵션 내용에 따라 다른 그라데이션 적용
    if (optionContent.includes('A') || optionContent.includes('1')) {
      return 'linear-gradient(90deg, #ff05ce 0%, #ff002f 100%)';
    } else if (optionContent.includes('B') || optionContent.includes('2')) {
      return 'linear-gradient(90deg, #6142ff 0%, #1478ff 100%)';
    } else {
      return 'linear-gradient(90deg, #ff05ce 0%, #ff002f 100%)'; // 기본 그라데이션
    }
  };

  // 데이터가 로드되면 부모 컴포넌트에 전달 (렌더링 후에 실행)
  useEffect(() => {
    if (userVoteInfo && username && userAvatar) {
      // TargetUser 형식으로 변환하여 부모 컴포넌트에 전달
      const targetUser = {
        nickname: username,
        description: hasVoted && votedOptionContent
          ? `> ${votedOptionContent}`
          : "아직 투표하지 않음",
        avatarUrl: userAvatar,
        highlightText: hasVoted ? votedOptionContent || undefined : undefined,
        voteTextColor: hasVoted ? getVoteTextColor(votedOptionContent) : undefined,
      };

      // 부모 컴포넌트에 유저 정보 전달
      onUserLoaded(targetUser);
    }
  }, [userVoteInfo, username, userAvatar, hasVoted, votedOptionContent, onUserLoaded]);

  // 에러가 발생하면 부모 컴포넌트에 전달 (렌더링 후에 실행)
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

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

  // UserInfoLoader는 UI를 렌더링하지 않고 데이터만 처리
  return null;
});UserInfoLoader.displayName = 'UserInfoLoader';

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
