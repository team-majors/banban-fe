interface MockUser {
  user_id: number;
  username: string;
  profileImage: string | null;
}

interface MockAdMeta {
  campaign_id: string;
  category: string;
}

interface MockFeed {
  feed_id: number;
  type: "NORMAL" | "AD" | "POLL";
  author: MockUser;
  content: string;
  ad_url: string | null;
  ad_meta: MockAdMeta | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_mine: boolean;
  user_vote_option_id: number | null;
}

interface MockFeedsData {
  content: MockFeed[];
  has_next: boolean;
  size: number;
  number_of_elements: number;
}

interface MockFeedsRequest {
  last_id: number;
  size: number;
}

interface MockFeedsResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: MockFeedsData;
}

export type { MockAdMeta, MockFeed, MockFeedsRequest, MockFeedsResponse, MockFeedsData, MockUser };
