import { apiFetch } from "@/lib/apiFetch";
import {
  FeedsRequest,
  FeedsResponse,
  HotFeedSnapshot,
  Feed,
} from "@/types/feeds";

/**
 * 피드 목록 조회
 * @param params - 요청 파라미터 (정렬, 필터, 페이지네이션)
 * @returns 피드 목록 응답
 */
export const getFeeds = async (
  params: FeedsRequest = {},
): Promise<FeedsResponse> => {
  const {
    last_id,
    size = 20,
    sort_by,
    sort_order,
    filter_type,
    poll_id,
  } = params;

  // 쿼리 파라미터 생성
  const queryParams = new URLSearchParams();

  if (last_id) queryParams.append("last_id", last_id.toString());
  if (size) queryParams.append("size", size.toString());
  if (sort_by) queryParams.append("sort_by", sort_by);
  if (sort_order) queryParams.append("sort_order", sort_order);
  if (filter_type) queryParams.append("filter_type", filter_type);
  if (typeof poll_id === "number") {
    queryParams.append("poll_id", poll_id.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/feeds?${queryString}` : "/feeds";

  return await apiFetch(url);
};

export const getHotFeed = async (pollId?: number): Promise<HotFeedSnapshot> => {
  const queryParams = new URLSearchParams();
  if (typeof pollId === "number") {
    queryParams.append("poll_id", pollId.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/feeds/hot?${queryString}` : "/feeds/hot";

  return apiFetch<HotFeedSnapshot>(url);
};

/**
 * 피드 수정
 * @param feedId - 수정할 피드 ID
 * @param content - 변경할 내용
 * @returns 수정된 피드
 */
export const updateFeed = async (
  feedId: number,
  content: string,
): Promise<{ data: Feed }> => {
  return apiFetch(`/feeds/${feedId}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
};

/**
 * 피드 삭제
 * @param feedId - 삭제할 피드 ID
 */
export const deleteFeed = async (feedId: number): Promise<void> => {
  await apiFetch(`/feeds/${feedId}`, {
    method: "DELETE",
  });
};
