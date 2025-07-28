"use server";

import { mockReplies } from "../data/reply";
import { MockReplyRequest, MockReplyResponse } from "../types/reply";

const getMockReplies = ({
  feed_id,
  last_id,
  size,
}: MockReplyRequest): Promise<MockReplyResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 20개 나올거임
      const filteredReplies = mockReplies
        .filter((r) => r.feed_id === feed_id)
        .sort((a, b) => a.id - b.id);

      const startIndex = last_id
        ? filteredReplies.findIndex((reply) => reply.id === last_id) + 1
        : 0;

      const replies = filteredReplies.slice(startIndex, startIndex + size);

      const data = {
        feed_id,
        content: replies,
        has_next: startIndex + size < filteredReplies.length,
        size: replies.length * 4,
        number_of_elements: replies.length,
      };

      const response: MockReplyResponse = {
        code: 200,
        status: "SUCCESS",
        data: data,
      };

      resolve(response);
    }, 500);
  });
};

export { getMockReplies };
