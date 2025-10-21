import { useState, useCallback, useEffect } from "react";
import { useToast } from "../components/common/Toast/useToast";
import { useDraft } from "./useDraft";
import { usePostContent } from "./usePostContent";

interface TargetUser {
  nickname: string;
  description: string;
  avatarUrl: string;
  highlightText?: string; // 강조할 텍스트
  voteTextColor?: string; // 투표 텍스트 색상
}

interface UseFloatingInputModalProps {
  actionType: "댓글" | "피드";
  feedId?: number;
  onClose: () => void;
  onSubmit: (content: string) => void;
  editMode?: boolean; // 피드 수정 모드 여부
  initialContent?: string; // 수정 모드일 때 초기 내용
}

export const useFloatingInputModal = ({
  actionType,
  feedId,
  onClose,
  onSubmit,
  editMode = false,
  initialContent,
}: UseFloatingInputModalProps) => {
  const { getDraft, saveDraft, clearDraft, restoreDraft } = useDraft(actionType);
  const { mutate, isPending } = usePostContent({
    onAfterSuccess: (actionType, content) => {
      if (actionType === "피드") {
        clearDraft();
      }
      onSubmit(content.trim());
      setContent("");
      onClose();
    },
  });

  const [content, setContent] = useState(initialContent || "");
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDraftRestorePrompt, setShowDraftRestorePrompt] = useState(false);
  const [pendingDraftContent, setPendingDraftContent] = useState<string | null>(null);
  const { showToast } = useToast();

  // 초안 복원 (피드 상태에서만, 수정 모드 제외)
  useEffect(() => {
    if (actionType === "피드" && !editMode) {
      const existingDraft = getDraft();
      if (existingDraft) {
        setPendingDraftContent(existingDraft);
        setShowDraftRestorePrompt(true);
      }
    }
  }, [actionType, editMode, getDraft]);

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return; // 빈 문자열 방어

    if (editMode) {
      // 수정 모드: 외부 onSubmit 직접 호출 (PUT)
      onSubmit(content.trim());
    } else {
      // 생성 모드: usePostContent의 mutate 호출 (POST)
      mutate({ content, actionType, feedId });
    }
  }, [content, editMode, onSubmit, mutate, actionType, feedId]);

  // 취소 핸들러 (수정 모드에서는 내용 변경 감지)
  const handleCancel = useCallback(() => {
    // 수정 모드에서는 originalContent와 비교하여 변경 여부 확인
    const hasChanges = editMode ? content.trim() !== (initialContent || "").trim() : content.trim();

    if (actionType === "피드" && hasChanges && !editMode) {
      setShowCancelConfirm(true);
    } else if (editMode && hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  }, [actionType, content, editMode, initialContent, onClose]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSubmit, handleCancel],
  );

  // 콘텐츠 변경 핸들러
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      saveDraft(newContent);
    },
    [saveDraft],
  );

  // 사용자 정보 로드 핸들러
  const handleUserLoaded = useCallback((user: TargetUser) => {
    setTargetUser(user);
  }, []);

  const handleUserError = useCallback((error: Error) => {
    console.error("Failed to load user info:", error);
  }, []);

  // 취소 확인 모달 핸들러들
  const handleSaveDraft = useCallback(() => {
    // 수정 모드에서는 저장 메시지 표시 안 함
    if (!editMode) {
      saveDraft(content);
      showToast({
        type: "info",
        message: "작성 중인 내용이 임시 저장되었습니다.",
        duration: 2000,
      });
    }
    setShowCancelConfirm(false);
    onClose();
  }, [content, editMode, saveDraft, showToast, onClose]);

  const handleDiscardDraft = useCallback(() => {
    if (!editMode) {
      clearDraft();
    }
    setShowCancelConfirm(false);
    onClose();
  }, [editMode, clearDraft, onClose]);

  const handleCancelConfirm = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

  const handleRestoreDraft = useCallback(() => {
    const restored = restoreDraft(setContent);
    if (restored) {
      showToast({
        type: "info",
        message: "임시 저장한 내용을 불러왔어요.",
        duration: 2000,
      });
    }
    setShowDraftRestorePrompt(false);
    setPendingDraftContent(null);
  }, [restoreDraft, setContent, showToast]);

  const handleSkipDraftRestore = useCallback(() => {
    clearDraft();
    setShowDraftRestorePrompt(false);
    setPendingDraftContent(null);
  }, [clearDraft]);

  return {
    // 상태
    content,
    targetUser,
    showCancelConfirm,
    showDraftRestorePrompt,
    pendingDraftContent,
    isPending,

    // 핸들러
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
  };
};
