import { MockUser } from "./feeds";

type MockReplyUser = MockUser;

interface MockReplyContent {
  id: number;
  feed_id: number;
  content: string;
  author: MockReplyUser;
  created_at: string;
  updated_at: string;
  like_count: number;
  is_liked: boolean;
  is_mine: boolean;
  mentioned_users: MockReplyUser[];
  user_vote_option_id: number | null;
}

interface MockReplyData {
  feed_id: number;
  content: MockReplyContent[];
  has_next: boolean;
  size: number;
  number_of_elements: number;
}

interface MockReplyRequest {
  feed_id: number;
  last_id: number | null;
  size: number;
}

interface MockReplyResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: MockReplyData;
}

export type {
  MockReplyUser,
  MockReplyContent,
  MockReplyData,
  MockReplyRequest,
  MockReplyResponse,
};
