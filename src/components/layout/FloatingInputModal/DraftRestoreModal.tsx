import styled from "styled-components";

interface DraftRestoreModalProps {
  onRestore: () => void;
  onSkip: () => void;
  preview?: string | null;
}

export const DraftRestoreModal = ({ onRestore, onSkip, preview }: DraftRestoreModalProps) => {
  const trimmedPreview = preview?.trim();
  const previewText =
    trimmedPreview && trimmedPreview.length > 120
      ? `${trimmedPreview.slice(0, 120)}…`
      : trimmedPreview;

  return (
    <ModalOverlay onClick={onSkip}>
      <ModalContainer onClick={(event) => event.stopPropagation()}>
        <ModalHeader>임시 저장한 내용이 있어요</ModalHeader>
        <ModalMessage>불러와서 이어서 작성할까요?</ModalMessage>
        {previewText && (
          <PreviewBox>
            <PreviewLabel>미리보기</PreviewLabel>
            <PreviewContent>{previewText}</PreviewContent>
          </PreviewBox>
        )}
        <ModalFooter>
          <PrimaryButton type="button" onClick={onRestore}>
            이어서 작성하기
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onSkip}>
            새로 작성할게요
          </SecondaryButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 24px;
  width: 400px;
  background: #ffffff;
  border: 1px solid #e9eaeb;
  border-radius: 12px;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08),
    0px 4px 6px -2px rgba(10, 13, 18, 0.03);
  box-sizing: border-box;
`;

const ModalHeader = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const ModalMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4b5563;
`;

const PreviewBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

const PreviewLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
`;

const PreviewContent = styled.p`
  margin: 0;
  font-size: 14px;
  color: #111827;
  line-height: 1.4;
  white-space: pre-line;
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ButtonBase = styled.button`
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.18s ease;
`;

const PrimaryButton = styled(ButtonBase)`
  background: #111827;
  color: #ffffff;

  &:hover {
    background: #1f2937;
  }

  &:active {
    background: #0f172a;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: #f9fafb;
  color: #1f2937;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #f3f4f6;
  }

  &:active {
    background: #e5e7eb;
  }
`;

