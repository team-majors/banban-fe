import { vi } from "vitest";

const useAuthMock = vi.fn(() => ({
  isLoggedIn: false,
  loading: true,
  user: {
    username: "user",
    email: "user@naver.com",
    profileImageUrl: undefined,
    usernameUpdatedAt: "202508140000",
  },
  login: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn(),
}));

export default useAuthMock;
