import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { PollOption, Poll } from "@/types/poll";
import { User } from "@/types/auth";

interface ApiResponse<T> {
  code: number;
  status: 'SUCCESS' | 'FAIL';
  data: T;
}

// User 타입을 확장하여 profile_image_url과 role 필드 추가
interface UserProfile extends User {
  profile_image_url: string;
  role: string;
}

interface UserVoteInfo {
  userProfile: UserProfile;
  pollData: Poll | null;
  votedOption: PollOption | null;
  voteStatus: 'not_voted' | 'voted' | 'loading' | 'error';
}

const fetchUserProfile = async (): Promise<UserProfile> => {
  const response: ApiResponse<UserProfile> = await apiFetch('/users/profile');
  return response.data;
};

const fetchPollData = async (date: string): Promise<Poll> => {
  const response: ApiResponse<Poll> = await apiFetch(`/polls?poll_date=${date}`);
  return response.data;
};

export const useUserVoteInfo = (date?: string) => {
  const currentDate = date || new Date().toISOString().split('T')[0];

  // 유저 프로필 정보 조회
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: () => fetchUserProfile(),
    staleTime: 1000 * 60 * 5, // 5분 캐시
    refetchOnWindowFocus: false,
  });

  // 투표 정보 조회
  const {
    data: pollData,
    isLoading: isPollLoading,
    error: pollError,
  } = useQuery<Poll, Error>({
    queryKey: ['poll', currentDate],
    queryFn: () => fetchPollData(currentDate),
    staleTime: 1000 * 60, // 1분 캐시
    refetchOnWindowFocus: false,
    enabled: !!userProfile, // 유저 프로필이 로드된 후에만 실행
  });

  // 투표한 옵션 찾기
  const votedOption = pollData?.voted_option_id
    ? pollData.options.find(option => option.id === pollData.voted_option_id)
    : null;

  // 로딩 상태 결정
  const isLoading = isProfileLoading || isPollLoading;

  // 에러 상태 결정
  const error = profileError || pollError;

  // 투표 상태 결정
  let voteStatus: UserVoteInfo['voteStatus'] = 'loading';
  if (error) {
    voteStatus = 'error';
  } else if (!isLoading && pollData) {
    voteStatus = pollData.has_voted ? 'voted' : 'not_voted';
  }

  const userVoteInfo: UserVoteInfo = {
    userProfile: userProfile || {
      username: '',
      email: '',
      profileImageUrl: '',
      username_updated_at: null,
      profile_image_url: '',
      role: '',
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
    hasVoted: voteStatus === 'voted',
    votedOptionContent: votedOption?.content || null,
    userAvatar: userProfile?.profile_image_url || null,
    username: userProfile?.username || null,
    userVoteOptionId: votedOption?.id || null,
  };
};
