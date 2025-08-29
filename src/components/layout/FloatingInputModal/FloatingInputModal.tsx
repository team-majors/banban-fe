"use client";

import { useFloatingInputModal } from "../../../hooks/useFloatingInputModal";
import { FeedInputForm } from "./FeedInputForm";
import { CancelConfirmModal } from "./CancelConfirmModal";

interface FloatingInputModalProps {
  onClose: () => void;
  onSubmit: (content: string) => void;
  actionType?: "댓글" | "피드"; // 등록할 콘텐츠 타입
  feedId?: number; // 댓글일 경우 필요한 피드 ID
}

export const FloatingInputModal = ({
  onClose,
  onSubmit,
  actionType = "댓글",
  feedId,
}: FloatingInputModalProps) => {
  // 커스텀 훅 사용
  const {
    content,
    targetUser,
    showCancelConfirm,
    isSubmitting,
    handleSubmit,
    handleCancel,
    handleKeyDown,
    handleContentChange,
    handleUserLoaded,
    handleUserError,
    handleSaveDraft,
    handleDiscardDraft,
    handleCancelConfirm,
  } = useFloatingInputModal({
    actionType,
    feedId,
    onClose,
    onSubmit,
  });

  return (
    <>
      <FeedInputForm
        content={content}
        onContentChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        targetUser={targetUser}
        onUserLoaded={handleUserLoaded}
        onUserError={handleUserError}
        actionType={actionType}
        isSubmitting={isSubmitting}
      />

      {showCancelConfirm && (
        <CancelConfirmModal
          onSave={handleSaveDraft}
          onDiscard={handleDiscardDraft}
          onCancel={handleCancelConfirm}
        />
      )}
    </>
  );
};
