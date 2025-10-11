import { getHotFeed } from "@/remote/feed";
import { HotFeed } from "@/types/feeds";
import { useQuery } from "@tanstack/react-query";

export default function useHotFeed() {
  return useQuery<HotFeed[], Error>({
    queryKey: ["hotFeed"],
    queryFn: () => getHotFeed(),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
