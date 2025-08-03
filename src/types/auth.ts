export interface User {
  username: string;
  email: string;
  profile_image_url: string;
  username_updated_at: string | null;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface TokenRequestResponse {
  code: number;
  status: "SUCCESS" | "FAILURE";
  data: {
    access_token: string;
    token_type: "bearer";
  };
}
