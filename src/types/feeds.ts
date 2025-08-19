interface User {
  id: number;
  username: string;
  profileImage: string | null;
}

interface AdMeta {
  campaignId: string;
  category: string;
}

interface Feed {
  id: number;
  type: "USER" | "AD" | "POLL";
  user: User;
  content: string;
  adUrl: string | null;
  adMeta: AdMeta | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isMine: boolean;
  userVoteOptionId: number | null;
}

interface FeedsData {
  content: Feed[];
  hasNext: boolean;
  size: number;
  numberOfElements: number;
}

interface FeedsRequest {
  lastId: number;
  size: number;
}

interface FeedsResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: FeedsData;
}

export type { AdMeta, Feed, FeedsRequest, FeedsResponse, User };
