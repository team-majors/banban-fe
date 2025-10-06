import type { CommentRequest, CommentResponse } from "@/types/comments";
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
    `/comments/?${feedIdParam}${lastIdParam}${sizeParam}`,
  );

  console.log(res);

  return res as CommentResponse;
};
