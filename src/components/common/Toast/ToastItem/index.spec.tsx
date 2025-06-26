import { describe } from "vitest";
import render from "@/utils/test/render";
import ToastItem from "./index";
import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Toast } from "../types";

describe("ToastItem", () => {
  const testToast: Toast = {
    id: "test-toast",
    type: "success",
    message: "테스트 메시지",
    duration: 1000,
  };

  it("메시지와 아이콘이 정상 렌더링된다", () => {
    render(<ToastItem toast={testToast} />);
    expect(screen.getByText("테스트 메시지")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close toast/i })
    ).toBeInTheDocument();
  });

  it("duration 후 자동으로 사라진다 (타이머 모킹)", async () => {
    render(<ToastItem toast={testToast} />);
    expect(screen.getByText("테스트 메시지")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("테스트 메시지")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  it("닫기 버튼을 누르면 즉시 사라진다", async () => {
    render(<ToastItem toast={testToast} />);
    const closeBtn = screen.getByRole("button", { name: /close toast/i });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByText("테스트 메시지")).not.toBeInTheDocument();
    });
  });

  it("aria-label과 role 속성이 존재한다", () => {
    render(<ToastItem toast={testToast} />);
    const closeBtn = screen.getByRole("button", { name: /close toast/i });
    expect(closeBtn).toHaveAttribute("aria-label", "Close Toast");
    expect(closeBtn).toHaveAttribute("role", "button");
  });
});
