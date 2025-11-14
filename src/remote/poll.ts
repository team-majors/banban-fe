import { apiFetch } from "@/lib/apiFetch";
import { BanbanResponse, PollResponse } from "@/types/api";
import { Poll } from "@/types/poll";
import { useAuthStore, waitForAuthReady } from "@/store/useAuthStore";
import normalizeDate from "@/utils/normalizeDate";

export const fetchPoll = async (date?: string): Promise<Poll> => {
  const normalizedDate = normalizeDate(date);

  const endpoint =
    normalizedDate && normalizedDate.length > 0
      ? `/polls?poll_date=${encodeURIComponent(normalizedDate)}`
      : "/polls";

  // 서버 환경에서 skip
  if (typeof window === "undefined") {
    throw new Error("fetchPoll은 클라이언트 환경에서만 실행됩니다");
  }

  await waitForAuthReady();

  const { isLoggedIn } = useAuthStore.getState();

  const response: PollResponse = await apiFetch(endpoint, {
    skipAuth: !isLoggedIn,
  });

  return response.data;
};

export const makeVote = async ({
  id,
}: {
  id: number;
}): Promise<BanbanResponse> => {
  return await apiFetch("/polls/votes", {
    method: "POST",
    body: JSON.stringify({ poll_option_id: id }),
  });
};
