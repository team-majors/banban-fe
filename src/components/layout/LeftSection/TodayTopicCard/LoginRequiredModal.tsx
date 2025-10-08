import { Modal } from "@/components/common/Modal";
import LockIcon from "@/components/svg/LockIcon";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  loginPath?: string;
}

export default function LoginReqruiedModal({
  isOpen,
  onClose,
  title = "로그인이 필요해요",
  message = "투표를 하려면 로그인이 필요합니다",
  loginPath = "/login",
}: LoginRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    router.push(loginPath);
  };

  return (
    <Modal isOpen onClose={onClose} isCloseButton={false}>
      <IconWrapper>
        <IconBackground>
          <LockIcon />
        </IconBackground>
      </IconWrapper>

      <ModalTitle>{title}</ModalTitle>
      <ModalMessage>{message}</ModalMessage>

      <ButtonGroup>
        <CancelButton onClick={onClose}>취소</CancelButton>
        <LoginButton onClick={handleLoginClick}>로그인하기</LoginButton>
      </ButtonGroup>
    </Modal>
  );
}

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  padding-top: 12px;
`;

const IconBackground = styled.div`
  width: 42px;
  height: 42px;
  padding: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  color: #718096;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  background: #f7fafc;
  color: #4a5568;

  &:hover {
    background: #edf2f7;
  }
`;

const LoginButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #633d8f 100%);
  }
`;
