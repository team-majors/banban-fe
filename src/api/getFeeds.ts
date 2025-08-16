import type { FeedsRequest, FeedsResponse } from "@/types/feeds";
import camelcaseKeys from "camelcase-keys";
import { apiFetch } from "@/lib/apiFetch";

const getFeeds = async ({
  lastId,
  size,
}: FeedsRequest): Promise<FeedsResponse> => {
  const lastIdParam = lastId === 0 ? '' : `last_id=${lastId}&`;
  const res = await apiFetch(`/feeds?${lastIdParam}size=${size}`);

  const convertedRes = camelcaseKeys(
    res as unknown as Record<string, unknown>,
    { deep: true },
  );
  
  return convertedRes as unknown as FeedsResponse;
};

export { getFeeds };
