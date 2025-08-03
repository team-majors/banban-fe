import { User } from "./auth";

export type ApiContext = "login" | "profile" | "vote" | "comment" | string;

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
