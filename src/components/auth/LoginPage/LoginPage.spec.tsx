import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "./LoginPage";
import render from "@/utils/test/render";

vi.mock("@/constants/loginButtons", () => ({
  LoginButtons: [
    {
      id: "kakao",
      fontColor: "#000000",
      backgroundColor: "#FEE500",
      iconSrc: "/kakao_symbol.png",
      text: "카카오로 시작하기",
    },
    {
      id: "naver",
      fontColor: "#fff",
      backgroundColor: "#03C75A",
      iconSrc: "/naver_symbol.png",
      text: "네이버로 로그인",
    },
  ],
}));

// fetch 모킹
const mockFetch = vi.fn();
global.fetch = mockFetch;

// window.location.href 모킹
Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

describe("로그인 페이지", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /** 유틸: fetch 성공 mock */
  const mockFetchSuccess = (url: string) =>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: url }),
    });

  /** 유틸: fetch 실패 mock */
  const mockFetchFailure = () => mockFetch.mockResolvedValueOnce({ ok: false });

  /** 유틸: 버튼 클릭 */
  const clickButton = (label: string) => {
    fireEvent.click(screen.getByText(label));
  };

  it("로고, 타이틀, 부제목이 표시된다", () => {
    render(<LoginPage />);

    expect(screen.getByAltText("login_btn_img kakao")).toBeInTheDocument();
    expect(screen.getByText("둘 중에 하나만 골라!")).toBeInTheDocument();
    expect(screen.getByText(/회원가입 없이 바로/)).toBeInTheDocument();
  });

  it("정의된 소셜 로그인 버튼이 모두 표시된다", () => {
    render(<LoginPage />);
    expect(screen.getByText("네이버로 로그인")).toBeInTheDocument();
    expect(screen.getByText("카카오로 시작하기")).toBeInTheDocument();
  });

  it("네이버 로그인 버튼 클릭 시 fetch 호출 후 window.location.href 변경", async () => {
    mockFetchSuccess("https://naver.com/login");

    render(<LoginPage />);
    clickButton("네이버로 로그인");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/naver`,
      );
      expect(window.location.href).toBe("https://naver.com/login");
    });
  });

  it("API 실패 시 alert가 호출된다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    mockFetchFailure();

    render(<LoginPage />);
    clickButton("카카오로 시작하기");

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
    });

    alertSpy.mockRestore();
  });
});
