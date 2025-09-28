import { useInfiniteQuery } from "@tanstack/react-query";
import type { FeedsResponse } from "@/types/feeds";
import { getFeeds } from "@/remote/feed";

export const useFeeds = () => {
  return useInfiniteQuery<FeedsResponse>({
    queryKey: ["feeds"],
    queryFn: ({ pageParam }) =>
      getFeeds({ lastId: pageParam as number, size: 8 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) {
        return undefined;
      }

      const lastFeed = lastPage.data.content[lastPage.data.content.length - 1];
      return lastFeed?.id;
    },
  });
};
