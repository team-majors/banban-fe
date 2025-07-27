import type { CommentRequest, CommentResponse } from "@/types/comments";
import { getMockReplies } from "@/mock/actions/reply";
import camelcaseKeys from "camelcase-keys";

const getComments = async ({
  feedId,
  lastId,
  size,
}: CommentRequest): Promise<CommentResponse> => {
  const res = await getMockReplies({ feed_id: feedId, last_id: lastId, size });

  const convertedRes = camelcaseKeys(
    res as unknown as Record<string, unknown>,
    { deep: true },
  );
  return convertedRes as unknown as CommentResponse;
};

export { getComments };
