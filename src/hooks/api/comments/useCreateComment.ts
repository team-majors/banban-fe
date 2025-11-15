import {
  InfiniteData,
  InfiniteQueryPageParamsOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createComment } from "@/remote/comment";
import type {
  CommentResponse,
  CreateCommentRequest,
  CreateCommentResponse,
} from "@/types/comments";
import type { Feed, FeedsResponse } from "@/types/feeds";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(data),
    onMutate: async (variables) => {
      const feedsQueryFilter = { queryKey: ["feeds"] as const };
      const commentQueryKey = ["comments", variables.feedId] as const;

      await Promise.all([
        queryClient.cancelQueries(feedsQueryFilter),
        queryClient.cancelQueries({ queryKey: commentQueryKey }),
      ]);

      const previousFeeds =
        queryClient.getQueriesData<
          InfiniteData<FeedsResponse, InfiniteQueryPageParamsOptions>
        >(feedsQueryFilter);

      const previousComments =
        queryClient.getQueryData<
          InfiniteData<CommentResponse, InfiniteQueryPageParamsOptions>
        >(commentQueryKey);

      incrementFeedCommentCount(queryClient, variables.feedId, 1);

      return {
        previousFeeds,
        previousComments,
        feedsQueryFilter,
        commentQueryKey,
        feedId: variables.feedId,
      };
    },
    onError: (error, _variables, context) => {
      console.error("댓글 작성 실패:", error);
      context?.previousFeeds?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.commentQueryKey && context.previousComments) {
        queryClient.setQueryData(context.commentQueryKey, context.previousComments);
      }
    },
    onSuccess: (response, _variables, context) => {
      if (!response?.data || !context?.commentQueryKey) {
        return;
      }

      appendCommentToCache(
        queryClient,
        context.commentQueryKey,
        response,
      );
    },
    onSettled: (_response, _error, _variables, context) => {
      if (context?.feedsQueryFilter) {
        queryClient.invalidateQueries(context.feedsQueryFilter);
      } else {
        queryClient.invalidateQueries({ queryKey: ["feeds"] });
      }

      if (context?.commentQueryKey) {
        queryClient.invalidateQueries({ queryKey: context.commentQueryKey });
      }
    },
  });
};

const incrementFeedCommentCount = (
  queryClient: ReturnType<typeof useQueryClient>,
  feedId: number,
  delta: number,
) => {
  const feedsQueryFilter = { queryKey: ["feeds"] as const };

  queryClient
    .getQueriesData<
      InfiniteData<FeedsResponse, InfiniteQueryPageParamsOptions>
    >(feedsQueryFilter)
    .forEach(([queryKey]) => {
      queryClient.setQueryData<
        InfiniteData<FeedsResponse, InfiniteQueryPageParamsOptions> | undefined
      >(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newData = structuredClone(oldData);
        let didUpdateAny = false;

        newData.pages.forEach((page) => {
          page.data.content = page.data.content.map((feed: Feed) => {
            if (feed.id !== feedId) {
              return feed;
            }

            didUpdateAny = true;

            return {
              ...feed,
              commentCount: feed.commentCount + delta,
            };
          });
        });

        return didUpdateAny ? newData : oldData;
      });
    });
};

const appendCommentToCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  commentQueryKey: readonly [string, number],
  response: CreateCommentResponse,
) => {
  queryClient.setQueryData<
    InfiniteData<CommentResponse, InfiniteQueryPageParamsOptions> | undefined
  >(commentQueryKey, (oldData) => {
    if (!oldData) return oldData;

    const newData = structuredClone(oldData);
    const firstPage = newData.pages[0];

    if (firstPage) {
      firstPage.data.content = [
        response.data,
        ...firstPage.data.content,
      ];
      firstPage.data.numberOfElements += 1;
    }

    return newData;
  });
};
