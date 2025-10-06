import { apiFetch } from "@/lib/apiFetch";
import {
  FeedsRequest,
  FeedsResponse,
  HotFeed,
  HotFeedResponse,
} from "@/types/feeds";

export const getFeeds = async ({
  lastId,
  size,
}: FeedsRequest): Promise<FeedsResponse> => {
  const lastIdParam = lastId === 0 ? "" : `last_id=${lastId}&`;
  const res: FeedsResponse = await apiFetch(
    `/feeds/?${lastIdParam}size=${size}`,
  );

  return res;
};

export const getHotFeed = async (): Promise<HotFeed[]> => {
  const response: HotFeedResponse = await apiFetch("/feeds/hot");
  return response.feeds;
};
