import { apiFetch } from "@/lib/apiFetch";
import { CommentContent, CommentResponse } from "@/types/comments";
import { Feed, FeedsResponse } from "@/types/feeds";
import { InfiniteData, InfiniteQueryPageParamsOptions, useMutation, useQueryClient } from "@tanstack/react-query";


interface UseFeedLikeOptimisticUpdateProps {
  id: number;
}

interface UseCommentLikeOptimisticUpdateProps {
  feedId: number;
  id: number;
}

export const useFeedLikeOptimisticUpdate = ({ id }: UseFeedLikeOptimisticUpdateProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch("/likes/", {
      method: "POST",
      body: JSON.stringify({
        target_id: id,
        target_type: "FEED",
      }),
    }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['feeds']});

      const oldData = queryClient.getQueryData<InfiniteData<FeedsResponse, InfiniteQueryPageParamsOptions>>(['feeds']);

      if (!oldData) return { oldData: null };

      const newData = structuredClone(oldData);

      newData.pages.forEach((page) => {
        page.data.content.forEach((feed: Feed) => {
          if (feed.id === id) {
            feed.isLiked = !feed.isLiked;
            feed.likeCount += feed.isLiked ? 1 : -1;
          }
        });
      });

      queryClient.setQueryData(['feeds'], newData);

      return { oldData };
    },
    onError: (error, variables, context) => {
      console.error("Error occurred:", error);
      queryClient.setQueryData(['feeds'], context?.oldData);
    }
  });
}

export const useCommentLikeOptimisticUpdate = ({ feedId, id }: UseCommentLikeOptimisticUpdateProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch("/likes/", {
      method: "POST",
      body: JSON.stringify({
        target_id: id,
        target_type: "COMMENT",
      }),
    }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments', feedId] });

      const oldData = queryClient.getQueryData<InfiniteData<CommentResponse, InfiniteQueryPageParamsOptions>>(['comments', feedId]);

      if (!oldData) return { oldData: null };

      const newData = structuredClone(oldData);

      newData.pages.forEach((page) => {
        page.data.content.forEach((comment: CommentContent) => {
          if (comment.id === id) {
            comment.isLiked = !comment.isLiked;
            comment.likeCount += comment.isLiked ? 1 : -1;
          }
        })
      })

      queryClient.setQueryData(['comments', feedId], newData);

      return { oldData };
    },
    onError: (error, variables, context) => {
      console.error("Error occurred:", error);
      queryClient.setQueryData(['comments', feedId], context?.oldData);
    }
  });
}
