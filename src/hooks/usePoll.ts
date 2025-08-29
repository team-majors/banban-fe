import { apiFetch } from "@/lib/apiFetch";
import { PollResponse } from "@/types/api";
import { Poll } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";

export const fetchPoll = async (date?: string): Promise<Poll> => {
  const response: PollResponse = await apiFetch(
    date === "" ? "/polls" : `/polls?poll_date=${date}`,
  );
  return response.data;
};

export const usePoll = (date?: string) => {
  return useQuery<Poll, Error>({
    queryKey: ["polls"],
    queryFn: () => fetchPoll(date || ""),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
