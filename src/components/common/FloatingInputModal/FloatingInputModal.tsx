"use client";

import { useEffect } from "react";
import { useFloatingInputModal } from "../../../hooks/ui/modal/useFloatingInputModal";
import { FeedInputForm } from "./FeedInputForm";
import { CancelConfirmModal } from "./CancelConfirmModal";
import { DraftRestoreModal } from "./DraftRestoreModal";
import { useFloatingModalStore } from "@/store/useFloatingModalStore";

interface FloatingInputModalProps {
  onClose: () => void;
  onSubmit: (content: string) => void;
  actionType?: "댓글" | "피드"; // 등록할 콘텐츠 타입
  feedId?: number; // 댓글일 경우 필요한 피드 ID
  editMode?: boolean; // 피드 수정 모드 여부
  initialContent?: string; // 수정 모드일 때 초기 내용
}

export const FloatingInputModal = ({
  onClose,
  onSubmit,
  actionType = "댓글",
  feedId,
  editMode = false,
  initialContent,
}: FloatingInputModalProps) => {
  // 커스텀 훅 사용
  const {
    content,
    targetUser,
    showCancelConfirm,
    showDraftRestorePrompt,
    pendingDraftContent,
    isPending,
    handleSubmit,
    handleCancel,
    handleKeyDown,
    handleContentChange,
    handleUserLoaded,
    handleUserError,
    handleSaveDraft,
    handleDiscardDraft,
    handleCancelConfirm,
    handleRestoreDraft,
    handleSkipDraftRestore,
  } = useFloatingInputModal({
    actionType,
    feedId,
    onClose,
    onSubmit,
    editMode,
    initialContent,
  });

  // 전역 모달 상태 관리
  useEffect(() => {
    const { setOpen, setClose } = useFloatingModalStore.getState();
    setOpen();
    return () => {
      setClose();
    };
  }, []);

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
        isPosting={isPending}
        editMode={editMode}
      />

      {showCancelConfirm && (
        <CancelConfirmModal
          onSave={handleSaveDraft}
          onDiscard={handleDiscardDraft}
          onCancel={handleCancelConfirm}
        />
      )}

      {showDraftRestorePrompt && (
        <DraftRestoreModal
          onRestore={handleRestoreDraft}
          onSkip={handleSkipDraftRestore}
          preview={pendingDraftContent}
        />
      )}
    </>
  );
};
