import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Header from ".";
import render from "@/utils/test/render";
import useAuth from "@/hooks/useAuth";
describe("Header 컴포넌트", () => {
  it("로딩 중이면 Skeleton이 렌더링된다", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      loading: true,
      user: { profileImageUrl: undefined },
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });
    render(<Header isNew={false} />);
    expect(await screen.findByTestId("header-skeleton")).toBeInTheDocument();
  });

  it("로그인 상태면 벨, 프로필 아이콘이 표시된다", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      loading: false,
      user: {
        username: "user",
        email: "user@naver.com",
        profileImageUrl: undefined,
        username_updated_at: "202508140000",
      },
      logout: vi.fn(),
      login: vi.fn(),
      checkAuth: vi.fn(),
    });

    render(<Header isNew={false} />);

    expect(await screen.findByLabelText("알림")).toBeInTheDocument();
    expect(await screen.findByLabelText("프로필")).toBeInTheDocument();
  });

  it("비로그인 상태면 로그인/회원가입 버튼이 표시된다", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      loading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });
    render(<Header isNew={false} />);

    expect(screen.getByText("로그인")).toBeInTheDocument();
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("새로운 알림이 있으면 레드닷이 렌더링된다", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      loading: false,
      user: { profileImageUrl: undefined },
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });
    render(<Header isNew={true} />);

    expect(screen.getByTestId("notification-dot")).toBeInTheDocument();
  });
});
