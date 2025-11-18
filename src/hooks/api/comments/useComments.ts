import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "@/remote/comment";
import type { CommentResponse } from "@/types/comments";

interface UseCommentsParams {
  feedId: number;
  size?: number;
}

export const useComments = ({ feedId, size = 20 }: UseCommentsParams) => {
  return useInfiniteQuery<CommentResponse>({
    queryKey: ["comments", feedId],
    queryFn: ({ pageParam }) =>
      getComments({ feedId, lastId: pageParam as number | null, size }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) {
        return undefined;
      }
      const lastComment =
        lastPage.data.content[lastPage.data.content.length - 1];
      return lastComment?.id ?? undefined;
    },
    enabled: !!feedId,
  });
};
