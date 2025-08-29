import { useCallback, useRef } from "react";

export const useDraft = (actionType: string) => {
  const hasRestoredDraft = useRef(false);

  // actionType에 따라 다른 localStorage 키 사용
  const getStorageKey = (type: string) => type === '댓글' ? 'comment-draft' : 'feed-draft';
  const getDiscardedKey = (type: string) => type === '댓글' ? 'comment-draft-discarded' : 'feed-draft-discarded';

  const saveDraft = useCallback((content: string) => {
    if (actionType === '댓글' || actionType === '피드') {
      localStorage.setItem(getStorageKey(actionType), content);
      // 저장하면 폐기 플래그는 제거
      localStorage.removeItem(getDiscardedKey(actionType));
    }
  }, [actionType]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(getStorageKey(actionType));
  }, [actionType]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(getStorageKey(actionType));
    localStorage.setItem(getDiscardedKey(actionType), 'true');
  }, [actionType]);

  const restoreDraft = useCallback((setContent: (content: string) => void) => {
    const currentDraftContent = typeof window !== 'undefined' ? localStorage.getItem(getStorageKey(actionType)) || '' : '';
    const currentHasDiscarded = typeof window !== 'undefined' ? localStorage.getItem(getDiscardedKey(actionType)) === 'true' : false;

    if ((actionType === '댓글' || actionType === '피드') && currentDraftContent && !hasRestoredDraft.current && !currentHasDiscarded) {
      setContent(currentDraftContent);
      hasRestoredDraft.current = true;
      return true; // 토스트 표시 가능
    }
    return false; // 토스트 표시 불가
  }, [actionType]);

  return { draftContent: '', saveDraft, clearDraft, discardDraft, restoreDraft };
};
