import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from ".";

describe("헤더 컴포넌트", () => {
  it("반반의 로고가 렌더링된다", () => {
    render(<Header isNew />);
    const logo = screen.getByTestId("banban-logo");
    expect(logo).toBeInTheDocument();
  });

  it("로그인시 벨모양 아이콘과 유저 아이콘이 표시된다", () => {
    render(<Header isNew />);
    const bellIcon = screen.getByTestId("bell-icon");
    const userIcon = screen.getByTestId("user-icon");
    expect(bellIcon).toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  it("새로운 알림이 생길 시 레드 닷 인디케이터가 렌더링된다", () => {
    render(<Header isNew />);
    const dot = screen.getByTestId("dot-indicator");
    expect(dot).toBeInTheDocument();
  });
});
