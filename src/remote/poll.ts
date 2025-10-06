import { apiFetch } from "@/lib/apiFetch";
import { BanbanResponse, PollResponse } from "@/types/api";
import { Poll } from "@/types/poll";

export const fetchPoll = async (date?: string): Promise<Poll> => {
  const response: PollResponse = await apiFetch(
    date === "" ? "/polls/" : `/polls/?poll_date=${date}`,
  );
  return response.data;
};

export const makeVote = async ({
  id,
}: {
  id: number;
}): Promise<BanbanResponse> => {
  const res: BanbanResponse = await apiFetch("/polls/votes/", {
    method: "POST",
    body: JSON.stringify({ poll_option_id: id }),
  });
  return res;
};
