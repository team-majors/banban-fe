import { apiFetch } from "@/lib/apiFetch";

export interface HotFeed {
  content: string;
  direction: "UP" | "DOWN";
  feed_id: number;
  rank: number;
  rank_change: number;
}

interface ApiResponse<T> {
  feeds: T[];
}

export const fetchHotFeed = async (): Promise<HotFeed[]> => {
  const response: ApiResponse<HotFeed> = await apiFetch("/feeds/hot");
  return response.feeds;
};
