export type SortBy = "created" | "like" | "comment";
export type SortOrder = "asc" | "desc";
export type FilterType = "all" | "same_vote";
export type FeedType = "NORMAL" | "AD";

interface User {
  id: number;
  username: string;
  profile_image: string | null;
}

interface AdMeta {
  campaign_id?: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface Feed {
  id: number;
  type: FeedType;
  user: User | null;
  content: string;
  ad_url: string | null;
  ad_meta: AdMeta | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_mine: boolean;
  user_vote_option_id: number | null;
}

export interface HotFeedAuthor {
  userId: number;
  username: string;
  profileImage: string | null;
}

export interface HotFeed {
  rank: number;
  feedId: number;
  content: string;
  rankChange: number | null;
  direction: "UP" | "DOWN" | "SAME" | null;
  author: HotFeedAuthor;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  type: FeedType;
}

export interface FeedsData {
  content: Feed[];
  has_next: boolean;
  size: number;
  number_of_elements: number;
}

interface FeedsRequest {
  last_id?: number;
  size?: number;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  filter_type?: FilterType;
}

interface FeedsResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: FeedsData;
}

export interface HotFeedSnapshot {
  snapshotAt: string;
  feeds: HotFeed[];
}

export type { AdMeta, Feed, FeedsRequest, FeedsResponse, User };
