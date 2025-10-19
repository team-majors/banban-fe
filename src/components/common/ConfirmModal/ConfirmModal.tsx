"use client";

import React from "react";
import { Modal } from "@/components/common/Modal";
import ModalCheck from "@/components/svg/ModalCheck";
import styled from "styled-components";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  isDanger = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCloseButton={false}>
      <IconWrapper $isDanger={isDanger}>
        <ModalCheck />
      </IconWrapper>
      <Title>{title}</Title>
      {message && <Message>{message}</Message>}
      <ButtonGroup>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button $primary $isDanger={isDanger} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </ButtonGroup>
    </Modal>
  );
};

const IconWrapper = styled.div<{ $isDanger?: boolean }>`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  color: ${({ $isDanger }) => ($isDanger ? "#ff4242" : "#4caf50")};
  margin-bottom: 24px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
`;

const Message = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean; $isDanger?: boolean }>`
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  ${({ $primary, $isDanger }) =>
    $primary
      ? `
    background-color: ${$isDanger ? "#ff4242" : "#3F13FF"};
    color: #fff;
  `
      : `
    background-color: #f5f5f5;
    color: #333;
  `}

  &:hover {
    opacity: 0.9;
  }
`;
