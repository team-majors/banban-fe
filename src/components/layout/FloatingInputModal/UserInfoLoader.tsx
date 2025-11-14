"use client";

import { memo, useEffect } from "react";
import { Avatar } from "../../common/Avatar/Avatar";
import { useUserVoteInfo } from "@/hooks/useUserVoteInfo";
import { useVoteOptionColor } from "@/hooks/useVoteOptionColor";
import { usePoll } from "@/hooks/usePoll";

interface TargetUser {
  nickname: string;
  description: string;
  avatarUrl: string;
  highlightText?: string;
  voteTextColor?: string;
  avatarBackground?: string;
}

interface UserInfoLoaderProps {
  onUserLoaded: (user: TargetUser) => void;
  onError?: (error: Error) => void;
}

export const UserInfoLoader = memo(
  ({ onUserLoaded, onError }: UserInfoLoaderProps) => {
    const {
      data: userVoteInfo,
      isLoading,
      error,
      hasVoted,
      votedOptionContent,
      userAvatar,
      username,
      userVoteOptionId,
    } = useUserVoteInfo();

    const { data: pollData } = usePoll();

    const textColor = useVoteOptionColor(userVoteOptionId, pollData);

    // --- 데이터 로드 후 부모에게 전달 ---
    useEffect(() => {
      if (userVoteInfo && username && userAvatar) {
        const targetUser: TargetUser = {
          nickname: username,
          description:
            hasVoted && votedOptionContent
              ? `> ${votedOptionContent}`
              : "아직 투표하지 않음",
          avatarUrl: userAvatar,
          highlightText: hasVoted ? votedOptionContent || undefined : undefined,
          voteTextColor: hasVoted ? textColor : undefined,
          avatarBackground: hasVoted ? textColor : undefined,
        };

        onUserLoaded(targetUser);
      }
    }, [
      userVoteInfo,
      username,
      userAvatar,
      hasVoted,
      votedOptionContent,
      textColor,
      onUserLoaded,
    ]);

    // --- 에러 전달 ---
    useEffect(() => {
      if (error && onError) {
        onError(error);
      }
    }, [error, onError]);

    // --- 로딩 Skeleton ---
    if (isLoading) {
      return (
        <div className="flex items-center gap-3 p-5">
          {/* 아바타 스켈레톤 */}
          <div
            className="w-12 h-12 rounded-full 
            bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
            animate-shimmer"
          />

          {/* 텍스트 스켈레톤 */}
          <div className="flex flex-col gap-1">
            <div
              className="rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
              animate-shimmer"
              style={{ width: "80px", height: "16px" }}
            />
            <div
              className="rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
              animate-shimmer"
              style={{ width: "120px", height: "14px" }}
            />
          </div>
        </div>
      );
    }

    // --- 에러 UI ---
    if (error) {
      return (
        <div className="flex items-center gap-3 p-5">
          <Avatar src="" alt="에러" size={48} />
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold text-red-500">
              유저 정보를 불러올 수 없습니다
            </span>
            <span className="text-[14px] text-gray-500">{error.message}</span>
          </div>
        </div>
      );
    }

    // UI는 렌더하지 않고 데이터만 넘김
    return null;
  },
);

UserInfoLoader.displayName = "UserInfoLoader";
