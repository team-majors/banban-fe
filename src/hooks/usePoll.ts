import { fetchPoll } from "@/remote/poll";
import { Poll } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";

export const usePoll = (date?: string) => {
  const normalized = date?.trim();
  const effectiveDate = normalized && normalized.length > 0 ? normalized : undefined;

  return useQuery<Poll, Error>({
    queryKey: ["polls", effectiveDate ?? "current"],
    queryFn: () => fetchPoll(effectiveDate),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
