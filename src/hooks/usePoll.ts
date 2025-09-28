import { fetchPoll } from "@/remote/poll";
import { Poll } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";

export const usePoll = (date: string) => {
  return useQuery<Poll, Error>({
    queryKey: ["polls", date],
    queryFn: () => fetchPoll(date),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: typeof date !== "undefined",
  });
};
