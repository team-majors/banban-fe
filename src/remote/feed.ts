import { apiFetch } from "@/lib/apiFetch";
import {
  FeedsRequest,
  FeedsResponse,
  HotFeedSnapshot,
} from "@/types/feeds";

/**
 * 피드 목록 조회
 * @param params - 요청 파라미터 (정렬, 필터, 페이지네이션)
 * @returns 피드 목록 응답
 */
export const getFeeds = async (
    params: FeedsRequest = {},
): Promise<FeedsResponse> => {
  const {last_id, size = 20, sort_by, sort_order, filter_type} = params;

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams();

  if (last_id) queryParams.append("last_id", last_id.toString());
  if (size) queryParams.append("size", size.toString());
  if (sort_by) queryParams.append("sort_by", sort_by);
  if (sort_order) queryParams.append("sort_order", sort_order);
  if (filter_type) queryParams.append("filter_type", filter_type);

  const queryString = queryParams.toString();
  const url = queryString ? `/feeds/?${queryString}` : "/feeds/";

  return await apiFetch(url);
};

export const getHotFeed = async (): Promise<HotFeedSnapshot> => {
  return apiFetch<HotFeedSnapshot>("/feeds/hot");
};
