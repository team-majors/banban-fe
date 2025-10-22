import styled from "styled-components";
import { Modal } from "@/components/common/Modal";

interface DraftRestoreModalProps {
  onRestore: () => void;
  onSkip: () => void;
  preview?: string | null;
  isOpen?: boolean;
}

export const DraftRestoreModal = ({
  onRestore,
  onSkip,
  preview,
  isOpen = true,
}: DraftRestoreModalProps) => {
  const trimmedPreview = preview?.trim();
  const previewText =
    trimmedPreview && trimmedPreview.length > 120
      ? `${trimmedPreview.slice(0, 120)}…`
      : trimmedPreview;

  return (
    <Modal isOpen={isOpen} onClose={onSkip} isCloseButton={false}>
      <Modal.Layout>
        <Modal.Title>임시 저장한 내용이 있어요</Modal.Title>
        <Modal.Description>불러와서 이어서 작성할까요?</Modal.Description>
        {previewText && (
          <PreviewBox>
            <PreviewLabel>미리보기</PreviewLabel>
            <PreviewContent>{previewText}</PreviewContent>
          </PreviewBox>
        )}
        <ModalFooter>
          <ModalButton variant="primary" onClick={onRestore}>
            이어서 작성하기
          </ModalButton>
          <Divider />
          <ModalButton variant="danger" onClick={onSkip}>
            새로 작성할게요
          </ModalButton>
        </ModalFooter>
      </Modal.Layout>
    </Modal>
  );
};

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
  gap: 0;
  width: 100%;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
`;

const ModalButton = styled.button<{ variant: "primary" | "danger" }>`
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

  color: ${(props) => (props.variant === "danger" ? "#FF8B8B" : "#111827")};

  &:hover {
    background: ${(props) =>
      props.variant === "danger" ? "#fef2f2" : "#f9fafb"};
  }

  &:active {
    background: ${(props) =>
      props.variant === "danger" ? "#fee2e2" : "#f3f4f6"};
  }
`;

