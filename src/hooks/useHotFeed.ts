import { getHotFeed } from "@/remote/feed";
import { HotFeed } from "@/types/feeds";
import { useQuery } from "@tanstack/react-query";

export default function useHotFeed() {
  return useQuery<HotFeed[], Error>({
    queryKey: ["hotFeed"],
    queryFn: () => getHotFeed(),
    staleTime: 1000 * 10,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });
}
