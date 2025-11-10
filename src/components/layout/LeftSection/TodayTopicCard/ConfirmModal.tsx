import { Modal } from "@/components/common/Modal";
import ModalCheck from "@/components/svg/ModalCheck";
import React from "react";
import styled from "styled-components";

export default function ConfirmModal({
  onClose,
  onVote,
  optionLabel,
  color,
}: {
  onClose: () => void;
  onVote: () => void;
  optionLabel: string | undefined;
  color: string;
}) {
  const voteHandler = () => {
    onVote();
    onClose();
  };

  return (
    <Modal isOpen onClose={() => {}} isCloseButton={false}>
      <IconWrapper>
        <ModalCheck />
      </IconWrapper>
      <Title>선택을 확정할까요?</Title>
      <HighlightText color={color}>{optionLabel}</HighlightText>
      <SubText>투표는 1번만 가능합니다. 이후에는 변경할 수 없습니다.</SubText>
      <ButtonGroup>
        <Button onClick={onClose}>취소</Button>
        <Button $primary onClick={voteHandler} color={color}>
          투표하기
        </Button>
      </ButtonGroup>
    </Modal>
  );
}

const IconWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  color: #4caf50;
  margin-bottom: 24px;
`;

const Title = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
`;

const HighlightText = styled.div<{ color: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-bottom: 8px;
`;

const SubText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean; color?: string }>`
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  ${({ $primary, color }) =>
    $primary
      ? `
        background-color: ${color};
        color: #fff;
      `
      : `
        background-color: #f5f5f5;
        color: #333;
      `};
`;
