"use client";

import styled from "styled-components";
import { ReactNode, useEffect, useState } from "react";
import type { FC, ButtonHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { CloseThickIcon } from "@/components/svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isCloseButton?: boolean;
}

type ModalActionVariant = "primary" | "secondary" | "danger";

interface ModalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ModalActionVariant;
  $fullWidth?: boolean;
}

const ModalBase = ({
  isOpen,
  onClose,
  children,
  isCloseButton = true,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
    setMounted(true);
  }, []);

  // ESC 키를 눌렀을 때 모달이 닫히는 UX
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (mounted) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [onClose, mounted]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <Dimmed className="modal-backdrop" onClick={onClose}>
      {/* 내부에서 발생한 클릭 이벤트가 Dimmed로 전파되는 걸 차단 */}
      <ModalBox
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
      >
        {isCloseButton && (
          <CloseButton onClick={onClose} aria-label="모달 닫기">
            <CloseThickIcon color="#414651" width={12} height={12} />
          </CloseButton>
        )}
        {children}
      </ModalBox>
    </Dimmed>,
    modalRoot,
  );
};

const Dimmed = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  max-width: calc(100vw - 32px);
  text-align: left;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 100%;
  background-color: #fafafa;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModalHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalFooterWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

const Header = ({ children }: { children: ReactNode }) => (
  <ModalHeaderWrapper>{children}</ModalHeaderWrapper>
);
Header.displayName = "Modal.Header";

const Body = ({ children }: { children: ReactNode }) => <div>{children}</div>;
Body.displayName = "Modal.Body";

const Footer = ({ children }: { children: ReactNode }) => (
  <ModalFooterWrapper>{children}</ModalFooterWrapper>
);
Footer.displayName = "Modal.Footer";

const ModalLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 600;
  color: #111827;
`;

const ModalDescription = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
`;

const ModalActions = styled.div<{
  align?: "start" | "center" | "end" | "stretch";
  direction?: "row" | "column";
}>`
  display: flex;
  gap: 12px;
  width: 100%;
  flex-wrap: ${({ direction = "row" }) =>
    direction === "row" ? "wrap" : "nowrap"};
  flex-direction: ${({ direction = "row" }) => direction};
  justify-content: ${({ align = "end", direction = "row" }) => {
    if (direction === "column") {
      return "flex-start";
    }
    switch (align) {
      case "start":
        return "flex-start";
      case "center":
        return "center";
      case "stretch":
        return "flex-start";
      default:
        return "flex-end";
    }
  }};
  ${({ align }) => align === "stretch" && "& > * { flex: 1; min-width: 0; }"}
  ${({ direction }) =>
    direction === "column" && "& > * { width: 100%; min-width: 0; }"}
`;

const variantStyles: Record<ModalActionVariant, string> = {
  primary: `
    background-color: #111827;
    color: #ffffff;

    &:hover {
      background-color: #1f2937;
    }

    &:active {
      background-color: #0f172a;
    }
  `,
  secondary: `
    background-color: #f9fafb;
    color: #1f2937;
    border: 1px solid #e5e7eb;

    &:hover {
      background-color: #f3f4f6;
    }

    &:active {
      background-color: #e5e7eb;
    }
  `,
  danger: `
    background-color: #dc2626;
    color: #ffffff;

    &:hover {
      background-color: #b91c1c;
    }

    &:active {
      background-color: #991b1b;
    }
  `,
};

const ModalButton = styled.button<ModalButtonProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease;
  ${({ $fullWidth }) => ($fullWidth ? "width: 100%;" : "min-width: 120px;")}

  ${({ $variant = "primary" }) => variantStyles[$variant]}
`;

type ModalComponent = FC<ModalProps> & {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
  Layout: typeof ModalLayout;
  Title: typeof ModalTitle;
  Description: typeof ModalDescription;
  Actions: typeof ModalActions;
  Button: typeof ModalButton;
};

export const Modal = ModalBase as ModalComponent;

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.Layout = ModalLayout;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Actions = ModalActions;
Modal.Button = ModalButton;
