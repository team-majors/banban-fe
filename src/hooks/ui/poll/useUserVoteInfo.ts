import { useQuery } from "@tanstack/react-query";
import { PollOption, Poll } from "@/types/poll";
import { UserProfile } from "@/types/auth";
import { getUserProfile } from "@/remote/user";
import { fetchPoll } from "@/remote/poll";
import { useAuthStore } from "@/store/useAuthStore";

interface UserVoteInfo {
  userProfile: UserProfile;
  pollData: Poll | null;
  votedOption: PollOption | null;
  voteStatus: "not_voted" | "voted" | "loading" | "error";
}

const fetchPollData = (date?: string) => fetchPoll(date);

export const useUserVoteInfo = (date?: string) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authLoading = useAuthStore((state) => state.loading);

  const normalized = date?.trim();
  const effectiveDate =
    normalized && normalized.length > 0 ? normalized : undefined;

  const shouldFetch = isLoggedIn && !authLoading;

  // 유저 프로필 정보 조회
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
    staleTime: 1000 * 60 * 5, // 5분 캐시
    refetchOnWindowFocus: false,
    enabled: shouldFetch,
  });

  // 투표 정보 조회
  const {
    data: pollData,
    isLoading: isPollLoading,
    error: pollError,
  } = useQuery<Poll, Error>({
    queryKey: ["poll", effectiveDate ?? "current"],
    queryFn: () => fetchPollData(effectiveDate),
    staleTime: 1000 * 60, // 1분 캐시
    refetchOnWindowFocus: false,
    enabled: !!userProfile && shouldFetch, // 유저 프로필이 로드된 후에만 실행
  });

  // 투표한 옵션 찾기
  const votedOption = pollData?.votedOptionId
    ? pollData.options.find((option) => option.id === pollData.votedOptionId)
    : null;

  // 로딩 상태 결정
  const isLoading = isProfileLoading || isPollLoading || authLoading;

  // 에러 상태 결정
  const error = profileError || pollError;

  // 투표 상태 결정
  let voteStatus: UserVoteInfo["voteStatus"] = "loading";
  if (!shouldFetch) {
    voteStatus = "not_voted";
  } else if (error) {
    voteStatus = "error";
  } else if (!isLoading && pollData) {
    voteStatus = pollData.hasVoted ? "voted" : "not_voted";
  }

  const userVoteInfo: UserVoteInfo = {
    userProfile: userProfile || {
      username: "",
      email: "",
      profileImageUrl: "",
      usernameUpdatedAt: null,
      role: "",
      hasCustomProfileImage: false,
    },
    pollData: pollData || null,
    votedOption: votedOption || null,
    voteStatus,
  };

  return {
    data: userVoteInfo,
    isLoading,
    error,
    // 편의 메서드들
    hasVoted: voteStatus === "voted",
    votedOptionContent: votedOption?.content || null,
    userAvatar: userProfile?.profileImageUrl || null,
    username: userProfile?.username || null,
    userVoteOptionId: votedOption?.id || null,
  };
};
