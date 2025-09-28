import { useCallback, useRef, useState, useEffect } from "react";

// 안전한 localStorage 접근 유틸
const safeLocalStorage = {
  get: (key: string) =>
    typeof window !== "undefined" ? localStorage.getItem(key) : null,
  set: (key: string, value: string) => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },
  remove: (key: string) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
};

type ActionType = "댓글" | "피드";

export const useDraft = (actionType: ActionType, autoRestore = false) => {
  const [draftContent, setDraftContent] = useState("");
  const hasRestoredDraft = useRef(false);

  const getStorageKey = (type: ActionType) =>
    type === "댓글" ? "comment-draft" : "feed-draft";

  // draft 저장
  const saveDraft = useCallback(
    (content: string) => {
      safeLocalStorage.set(getStorageKey(actionType), content);
      setDraftContent(content);
    },
    [actionType],
  );

  // draft 삭제
  const clearDraft = useCallback(() => {
    safeLocalStorage.remove(getStorageKey(actionType));
    setDraftContent("");
  }, [actionType]);

  // draft 복원
  const restoreDraft = useCallback(
    (setContent: (content: string) => void) => {
      const currentDraftContent =
        safeLocalStorage.get(getStorageKey(actionType)) || "";

      if (currentDraftContent && !hasRestoredDraft.current) {
        setContent(currentDraftContent);
        setDraftContent(currentDraftContent);
        hasRestoredDraft.current = true;
        return true; // 복원 성공
      }
      return false; // 복원 실패
    },
    [actionType],
  );

  // 옵션: 자동 복원
  useEffect(() => {
    if (autoRestore) {
      restoreDraft(setDraftContent);
    }
  }, [autoRestore, restoreDraft]);

  return {
    draftContent,
    saveDraft,
    clearDraft,
    restoreDraft,
  };
};
