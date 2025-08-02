'use server';

import { mockFeeds } from "../data/feeds";
import { MockFeedsRequest, MockFeedsResponse } from "../types/feeds";

const getMockFeeds = ({
  last_id,
  size,
}: MockFeedsRequest): Promise<MockFeedsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = last_id
        ? mockFeeds.findIndex((feed) => feed.feed_id === last_id) + 1
        : 0;

      const feeds = mockFeeds.slice(startIndex, startIndex + size);
      
      const data = {
        content: feeds,
        has_next: startIndex + size < mockFeeds.length,
        size: feeds.length * 4,
        number_of_elements: feeds.length,
      };

      const response: MockFeedsResponse = {
        code: 200,
        status: "SUCCESS",
        data: data,
      };
      
      resolve(response);
    }, 500);
  });
};

export { getMockFeeds };