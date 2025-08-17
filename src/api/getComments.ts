import type { CommentRequest, CommentResponse } from "@/types/comments";
import camelcaseKeys from "camelcase-keys";
import { apiFetch } from "@/lib/apiFetch";

const getComments = async ({
  feedId,
  lastId,
  size,
}: CommentRequest): Promise<CommentResponse> => {
  const feedIdParam = `feed_id=${feedId}&`;
  const lastIdParam = lastId ? `last_id=${lastId}&` : "";
  const sizeParam = `size=${size}`;

  const res = await apiFetch(`/comments?${feedIdParam}${lastIdParam}${sizeParam}`);

  console.log(res);

  const convertedRes = camelcaseKeys(
    res as unknown as Record<string, unknown>,
    { deep: true },
  );
  return convertedRes as unknown as CommentResponse;
};

export { getComments };
