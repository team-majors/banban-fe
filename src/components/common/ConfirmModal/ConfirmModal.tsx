"use client";

import React from "react";
import styled from "styled-components";
import { Modal } from "@/components/common/Modal";

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
      <Modal.Layout>
        <Modal.Title>{title}</Modal.Title>
        {message && <Modal.Description>{message}</Modal.Description>}
        <ModalFooter>
          <ModalButton
            variant={isDanger ? "danger" : "primary"}
            onClick={handleConfirm}
          >
            {confirmText}
          </ModalButton>
          <Divider />
          <ModalButton variant="secondary" onClick={onClose}>
            {cancelText}
          </ModalButton>
        </ModalFooter>
      </Modal.Layout>
    </Modal>
  );
};

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
`;

const ModalButton = styled.button<{
  variant: "primary" | "secondary" | "danger";
}>`
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
  border-radius: 6px;

  color: ${(props) => {
    switch (props.variant) {
      case "danger":
        return "#FF8B8B";
      default:
        return "#111827";
    }
  }};

  &:hover {
    background: ${(props) => {
      switch (props.variant) {
        case "danger":
          return "#fef2f2";
        default:
          return "#f9fafb";
      }
    }};
  }

  &:active {
    background: ${(props) => {
      switch (props.variant) {
        case "danger":
          return "#fee2e2";
        default:
          return "#f3f4f6";
      }
    }};
  }
`;
