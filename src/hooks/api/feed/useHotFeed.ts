import { getHotFeed } from "@/remote/feed";
import { HotFeedSnapshot } from "@/types/feeds";
import { useQuery } from "@tanstack/react-query";

interface UseHotFeedOptions {
  enabled?: boolean;
}

export default function useHotFeed(
  pollId?: number,
  options: UseHotFeedOptions = {},
) {
  const enabled = options.enabled ?? true;

  return useQuery<HotFeedSnapshot, Error>({
    queryKey: ["hotFeed", pollId ?? "current"],
    queryFn: () => getHotFeed(pollId),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled,
  });
}
