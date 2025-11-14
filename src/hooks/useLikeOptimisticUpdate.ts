import { apiFetch } from "@/lib/apiFetch";
import { CommentContent, CommentResponse } from "@/types/comments";
import { Feed, FeedsResponse } from "@/types/feeds";
import {
  InfiniteData,
  InfiniteQueryPageParamsOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface UseFeedLikeOptimisticUpdateProps {
  id: number;
}

interface UseCommentLikeOptimisticUpdateProps {
  feedId: number;
  id: number;
}

export const useFeedLikeOptimisticUpdate = ({
  id,
}: UseFeedLikeOptimisticUpdateProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch("/likes", {
        method: "POST",
        body: JSON.stringify({
          target_id: id,
          target_type: "FEED",
        }),
      }),
    onMutate: async () => {
      const queryFilter = { queryKey: ["feeds"] as const };

      await queryClient.cancelQueries(queryFilter);

      const previousFeeds =
        queryClient.getQueriesData<
          InfiniteData<FeedsResponse, InfiniteQueryPageParamsOptions>
        >(queryFilter);

      previousFeeds.forEach(([queryKey]) => {
        queryClient.setQueryData<
          | InfiniteData<FeedsResponse, InfiniteQueryPageParamsOptions>
          | undefined
        >(queryKey, (oldData) => {
          if (!oldData) return oldData;

          const newData = structuredClone(oldData);
          const isLikeSortQuery = isLikeSort(queryKey);
          let didUpdateAny = false;

          newData.pages.forEach((page) => {
            let updatedInPage = false;

            const updatedContent = page.data.content.map((feed: Feed) => {
              if (feed.id !== id) {
                return feed;
              }

              const nextIsLiked = !feed.isLiked;
              updatedInPage = true;
              didUpdateAny = true;

              return {
                ...feed,
                isLiked: nextIsLiked,
                likeCount: feed.likeCount + (nextIsLiked ? 1 : -1),
              };
            });

            if (updatedInPage && isLikeSortQuery) {
              page.data.content = reorderByLikeCount(updatedContent);
            } else {
              page.data.content = updatedContent;
            }
          });

          return didUpdateAny ? newData : oldData;
        });
      });

      return { previousFeeds, queryFilter };
    },
    onError: (error, variables, context) => {
      console.error("Error occurred:", error);
      context?.previousFeeds?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_, __, ___, context) => {
      const filter = context?.queryFilter ?? { queryKey: ["feeds"] as const };
      queryClient.invalidateQueries(filter);
    },
  });
};

export const useCommentLikeOptimisticUpdate = ({
  feedId,
  id,
}: UseCommentLikeOptimisticUpdateProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch("/likes", {
        method: "POST",
        body: JSON.stringify({
          target_id: id,
          target_type: "COMMENT",
        }),
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["comments", feedId] });

      const oldData = queryClient.getQueryData<
        InfiniteData<CommentResponse, InfiniteQueryPageParamsOptions>
      >(["comments", feedId]);

      if (!oldData) return { oldData: null };

      const newData = structuredClone(oldData);

      newData.pages.forEach((page) => {
        page.data.content.forEach((comment: CommentContent) => {
          if (comment.id === id) {
            comment.isLiked = !comment.isLiked;
            comment.likeCount += comment.isLiked ? 1 : -1;
          }
        });
      });

      queryClient.setQueryData(["comments", feedId], newData);

      return { oldData };
    },
    onError: (error, variables, context) => {
      console.error("Error occurred:", error);
      queryClient.setQueryData(["comments", feedId], context?.oldData);
    },
  });
};

const isLikeSort = (queryKey: unknown): boolean => {
  if (!Array.isArray(queryKey)) return false;
  const params = queryKey[1];

  if (!params || typeof params !== "object") {
    return false;
  }

  return (
    "sort_by" in params && (params as { sort_by?: string }).sort_by === "like"
  );
};

const reorderByLikeCount = (content: Feed[]): Feed[] => {
  const ads: { index: number; item: Feed }[] = [];
  const feeds: Feed[] = [];

  content.forEach((item, index) => {
    if (item.type === "AD") {
      ads.push({ index, item });
    } else {
      feeds.push(item);
    }
  });

  feeds.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));

  const result: Feed[] = [...content];
  const adLookup = new Map<number, Feed>();

  ads.forEach(({ index, item }) => {
    adLookup.set(index, item);
  });

  let feedIndex = 0;

  for (let i = 0; i < result.length; i += 1) {
    const adAtPosition = adLookup.get(i);

    if (adAtPosition) {
      result[i] = adAtPosition;
    } else {
      result[i] = feeds[feedIndex] ?? result[i];
      feedIndex += 1;
    }
  }

  return result;
};
