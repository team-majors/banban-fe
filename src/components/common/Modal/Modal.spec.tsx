import { afterEach, beforeEach, describe, vi } from "vitest";
import render from "@/utils/test/render";
import { Modal } from "./Modal";
import { fireEvent, screen } from "@testing-library/react";

describe("Modal", () => {
  beforeEach(() => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
    onCloseMock.mockClear();
  });

  afterEach(() => {
    const modalRoot = document.getElementById("modal-root");
    modalRoot?.remove();
  });

  const onCloseMock = vi.fn();

  it("모달이 열렸을 때 children이 portal로 렌더링 된다", async () => {
    await render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div data-testid="modal-content">오하요</div>
      </Modal>,
    );

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });

  it("모달이 닫혔을 떄 아무것도 렌더링이 안 된다.", async () => {
    const { container } = await render(
      <Modal isOpen={false} onClose={onCloseMock}>
        <div>children</div>
      </Modal>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Dimmed(뒷 배경) 클릭 시 onClose 함수가 실행된다.", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>contents</div>
      </Modal>,
    );

    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("ESC키를 누르면 onClose 함수가 실행된다", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>contents</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
