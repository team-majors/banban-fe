import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Input } from "./Input";

describe("Input Component", () => {
  it("기본적인 렌더링 확인", () => {
    render(
      <Input>
        <Input.Label>테스트 라벨</Input.Label>
        <Input.Field placeholder="테스트 플레이스홀더" $isValidate={true} />
      </Input>,
    );

    const inputElement = screen.getByPlaceholderText("테스트 플레이스홀더");
    const labelElement = screen.getByText("테스트 라벨");

    expect(inputElement).toBeInTheDocument();
    expect(labelElement).toBeInTheDocument();
  });

  it("사용자가 텍스트를 입력하면 값이 변경", async () => {
    const user = userEvent.setup();
    render(
      <Input>
        <Input.Label>테스트 라벨</Input.Label>
        <Input.Field placeholder="값을 입력하세요" $isValidate={true} />
      </Input>,
    );

    const inputElement = screen.getByPlaceholderText(
      "값을 입력하세요",
    ) as HTMLInputElement;
    await user.type(inputElement, "안녕하세요");

    expect(inputElement.value).toBe("안녕하세요");
  });

  it("onChange 호출 확인", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Input>
        <Input.Label>테스트 라벨</Input.Label>
        <Input.Field
          placeholder="값을 입력하세요"
          onChange={handleChange}
          $isValidate={true}
        />
      </Input>,
    );

    const inputElement = screen.getByPlaceholderText("값을 입력하세요");
    await user.type(inputElement, "hello");

    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it("$isValidate가 false일 때 에러 메시지와 스타일 적용 확인", () => {
    const errorMessage = "에러가 발생했습니다.";
    render(
      <Input>
        <Input.Label>테스트 라벨</Input.Label>
        <Input.Field placeholder="값을 입력하세요" $isValidate={false} />
        <Input.ErrorMessage>{errorMessage}</Input.ErrorMessage>
      </Input>,
    );

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText("값을 입력하세요");
    expect(inputElement).toHaveStyle("border-color: #ff474f");
    expect(inputElement).toHaveStyle("color: #ff474f");
  });

  it("아이콘 렌더링 확인", () => {
    const icon = <span>ICON</span>;
    render(
      <Input>
        <Input.Label>테스트 라벨</Input.Label>
        <Input.Field
          placeholder="값을 입력하세요"
          $isValidate={true}
          $icon={icon}
        />
      </Input>,
    );

    const iconElement = screen.getByText("ICON");
    expect(iconElement).toBeInTheDocument();
  });
});
