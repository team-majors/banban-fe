import { useInfiniteQuery } from "@tanstack/react-query";
import type { FeedsResponse, FeedsRequest } from "@/types/feeds";
import { getFeeds } from "@/remote/feed";

/**
 * 피드 목록 무한 스크롤 훅
 * @param params - 정렬, 필터 옵션 (last_id는 자동 처리)
 * @returns React Query 무한 쿼리 결과
 */
export const useFeeds = (params: Omit<FeedsRequest, "last_id"> = {}) => {
  const { size = 20, sort_by = "created", sort_order = "desc", filter_type = "all" } = params;

  return useInfiniteQuery<FeedsResponse>({
    queryKey: ["feeds", { sort_by, sort_order, filter_type, size }],
    queryFn: ({ pageParam }) =>
      getFeeds({
        last_id: pageParam as number | undefined,
        size,
        sort_by,
        sort_order,
        filter_type,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.has_next) {
        return undefined;
      }

      const lastFeed = lastPage.data.content[lastPage.data.content.length - 1];
      return lastFeed?.id;
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
