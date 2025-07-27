
import { MockUser } from "../mock/types/feeds";

type CommentUser = MockUser;

interface CommentContent {
  id: number;
  feedId: number;
  content: string;
  author: CommentUser;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
  isMine: boolean;
  mentionedUsers: CommentUser[];
  userVoteOptionId: number | null;
}

interface CommentData {
  feedId: number;
  content: CommentContent[];
  hasNext: boolean;
  size: number;
  numberOfElements: number;
}

interface CommentRequest {
  feedId: number;
  lastId: number | null;
  size: number;
}

interface CommentResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: CommentData;
}

export type {
  CommentUser,
  CommentContent,
  CommentData,
  CommentRequest,
  CommentResponse,
}