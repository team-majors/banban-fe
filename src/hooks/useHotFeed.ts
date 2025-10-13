import { getHotFeed } from "@/remote/feed";
import { HotFeedSnapshot } from "@/types/feeds";
import { useQuery } from "@tanstack/react-query";

export default function useHotFeed() {
  return useQuery<HotFeedSnapshot, Error>({
    queryKey: ["hotFeed"],
    queryFn: () => getHotFeed(),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
