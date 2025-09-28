export interface User {
  username: string;
  email: string;
  profileImageUrl: string;
  usernameUpdatedAt: string | null;
}

export interface UserProfile extends User {
  profileImageUrl: string;
  role: string;
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
