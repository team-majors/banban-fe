import { useState, useCallback } from "react";
import { useToast } from "../components/common/Toast/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";

interface CommentRequestBody {
  feed_id: number;
  content: string;
}

interface FeedRequestBody {
  content: string;
}

export const useContentSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const submitContent = useCallback(async (content: string, actionType: string, feedId?: number) => {
    if (!content.trim() || isSubmitting) return false;

    setIsSubmitting(true);
    try {
      // actionType에 따라 다른 API 엔드포인트 사용
      const endpoint = actionType === '댓글' ? '/comments' : '/feeds';

      // request body 구성
      let requestBody: CommentRequestBody | FeedRequestBody;

      if (actionType === '댓글') {
        if (feedId === undefined) {
          throw new Error('댓글 등록 시 feedId가 필요합니다.');
        }
        requestBody = {
          feed_id: feedId,
          content: content.trim()
        };
      } else {
        requestBody = {
          content: content.trim()
        };
      }

      await apiFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      showToast({
        type: 'success',
        message: `${actionType}이/가 성공적으로 등록되었습니다!`,
        duration: 3000
      });

      // actionType에 따라 다른 쿼리 무효화
      const queryKey = actionType === '댓글' ? ['comments'] : ['feeds'];
      queryClient.invalidateQueries({ queryKey });

      return true;
    } catch (error) {
      console.error('Failed to submit content:', error);
      showToast({
        type: 'error',
        message: `${actionType} 등록에 실패했습니다. 다시 시도해주세요.`,
        duration: 4000
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, showToast, queryClient]);

  return { isSubmitting, submitContent };
};
