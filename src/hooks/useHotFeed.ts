import { fetchHotFeed, HotFeed } from "@/remote/feed";
import { useQuery } from "@tanstack/react-query";

export default function useHotFeed() {
  return useQuery<HotFeed[], Error>({
    queryKey: ["hotFeed"],
    queryFn: () => fetchHotFeed(),
    staleTime: 1000 * 10,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });
}
