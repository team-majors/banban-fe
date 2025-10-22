"use client";

import React from "react";
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
        <Modal.Actions direction="column">
          <Modal.Button
            $variant={isDanger ? "danger" : "primary"}
            onClick={handleConfirm}
            fullWidth
          >
            {confirmText}
          </Modal.Button>
          <Modal.Button
            $variant="secondary"
            onClick={onClose}
            fullWidth
          >
            {cancelText}
          </Modal.Button>
        </Modal.Actions>
      </Modal.Layout>
    </Modal>
  );
};
