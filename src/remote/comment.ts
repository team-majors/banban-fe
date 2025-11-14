import type {
  CommentContent,
  CommentRequest,
  CommentResponse,
  CreateCommentRequest,
  CreateCommentResponse,
} from "@/types/comments";
import { apiFetch } from "@/lib/apiFetch";

export const getComments = async ({
  feedId,
  lastId,
  size,
}: CommentRequest): Promise<CommentResponse> => {
  const feedIdParam = `feed_id=${feedId}&`;
  const lastIdParam = lastId ? `last_id=${lastId}&` : "";
  const sizeParam = `size=${size}`;

  const res = await apiFetch(
    `/comments?${feedIdParam}${lastIdParam}${sizeParam}`,
  );

  console.log(res);

  return res as CommentResponse;
};

export const createComment = async ({
  feedId,
  content,
}: CreateCommentRequest): Promise<CreateCommentResponse> => {
  const res = await apiFetch(`/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      feed_id: feedId,
      content,
    }),
  });

  return res as CreateCommentResponse;
};

export const updateComment = async (
  commentId: number,
  content: string,
): Promise<{ data: CommentContent }> => {
  return apiFetch(`/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await apiFetch(`/comments/${commentId}`, {
    method: "DELETE",
  });
};
