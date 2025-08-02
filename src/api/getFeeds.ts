import type { FeedsRequest, FeedsResponse } from "@/types/feeds";
import { getMockFeeds } from "@/mock/actions/feeds";
import camelcaseKeys from "camelcase-keys";

const getFeeds = async ({ lastId, size }: FeedsRequest): Promise<FeedsResponse> => {
  const res = await getMockFeeds({ last_id: lastId, size: size });

  const convertedRes = camelcaseKeys(res as unknown as Record<string, unknown>, { deep: true });
  return convertedRes as unknown as FeedsResponse;
};

export { getFeeds };
