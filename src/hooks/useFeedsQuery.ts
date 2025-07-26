import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeeds } from "@/api/getFeeds";
import type { FeedsResponse } from "@/types/feeds";

const useFeedsQuery = () => {
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
      return lastFeed?.feedId;
    },
  });
};

export { useFeedsQuery };
