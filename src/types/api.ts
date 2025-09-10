import { User } from "./auth";
import { Poll } from "./poll";

export type ApiContext = "login" | "profile" | "vote" | "comment" | string;

export interface ApiResponse<T> {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: T;
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface UserInfoResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: User;
}

export interface PollResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: Poll;
}

export interface BanbanResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: object;
}
