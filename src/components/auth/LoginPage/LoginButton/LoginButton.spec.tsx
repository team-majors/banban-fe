import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import render from "@/utils/test/render";
import { LoginButton } from "./LoginButton";
import { vi } from "vitest";

describe("LoginButton", () => {
  const defaultProps = {
    color: "#007bff",
    fontcolor: "#ffffff",
    children: "Login",
  };

  describe("렌더링", () => {
    it("로그인 버튼 컴포넌트가 정상적으로 렌더링된다", () => {
      render(<LoginButton {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("prop으로 전달한 text와 icon이 렌더링 된다", () => {
      const TestIcon = () => <span data-testid="test-icon">🔒</span>;
      render(
        <LoginButton {...defaultProps} icon={<TestIcon />}>
          Login with Icon
        </LoginButton>
      );

      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      expect(screen.getByText("Login with Icon")).toBeInTheDocument();
    });
  });

  describe("스타일링", () => {
    it("설정한 배경색이 올바르게 적용된다", () => {
      render(<LoginButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle(`background-color: ${defaultProps.color}`);
    });

    it("설정한 폰트 색상이 올바르게 적용된다", () => {
      render(<LoginButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle(`color: ${defaultProps.fontcolor}`);
    });

    it("버튼이 비활성화되면 비활성 스타일이 적용된다", () => {
      render(<LoginButton {...defaultProps} disabled />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle("opacity: 0.5");
      expect(button).toHaveStyle("cursor: default");
    });

    it("비활성이지 않을 때 커서가 포인터모양으로 바귄다", () => {
      render(<LoginButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveStyle("cursor: pointer");
    });
  });

  describe("접근성", () => {
    it("disabled시 aria-disabled 는 true", () => {
      render(<LoginButton {...defaultProps} disabled />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("not disabled시 aria-disabled 값은 false", () => {
      render(<LoginButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "false");
    });

    it("disabled가 아닐 때 focus가 가능하다", () => {
      render(<LoginButton {...defaultProps} />);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("인터랙션", () => {
    it("클릭시 onClick 핸들러를 실행한다", () => {
      const handleClick = vi.fn();
      render(<LoginButton {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled시 클릭해도 onClick 핸들러를 실행하지 않는다.", () => {
      const handleClick = vi.fn();
      render(<LoginButton {...defaultProps} onClick={handleClick} disabled />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("프롭 포워딩", () => {
    it("button에 HTML 속성들을 잘 전달한다", () => {
      render(
        <LoginButton
          {...defaultProps}
          id="test-button"
          className="custom-class"
          data-testid="custom-button"
          type="submit"
          form="test-form"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toHaveAttribute(
        "class",
        expect.stringContaining("custom-class")
      );
      expect(button).toHaveAttribute("data-testid", "custom-button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("form", "test-form");
    });
  });

  describe("사용자 실수 또는 예외 입력", () => {
    it("children이 없어도 정상적으로 렌더링 된다.", () => {
      render(<LoginButton color="#007bff" fontcolor="#ffffff" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
    it("prop을 다른 형식으로 줘도 에러가 나지 않는다", async () => {
      const { rerender } = await render(
        <LoginButton {...defaultProps} color="#007bff" />
      );
      expect(screen.getByRole("button")).toHaveStyle(
        "background-color: #007bff"
      );

      rerender(<LoginButton {...defaultProps} color="rgb(255, 0, 0)" />);
      expect(screen.getByRole("button")).toHaveStyle(
        "background-color: rgb(255, 0, 0)"
      );
    });
  });
});
