import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/remote/comment";
import type { CreateCommentRequest } from "@/types/comments";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(data),
    onSuccess: (_, variables) => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.feedId],
      });
    },
  });
};
