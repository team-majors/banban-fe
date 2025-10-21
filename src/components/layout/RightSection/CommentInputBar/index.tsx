"use client";

import { useState, useCallback } from "react";
import styled from "styled-components";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useToast } from "@/components/common/Toast/useToast";
import { CommentComposer } from "./CommentComposer";

interface CommentInputBarProps {
  feedId: number;
  onSubmit?: (content: string) => void;
}

export default function CommentInputBar({ feedId, onSubmit }: CommentInputBarProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCommentMutation = useCreateComment();
  const toast = useToast();

  const handleSubmit = useCallback(() => {
    // 중복 제출 방지: isPending과 isSubmitting 모두 체크
    if (!content.trim() || createCommentMutation.isPending || isSubmitting) return;

    setIsSubmitting(true);

    createCommentMutation.mutate(
      { feedId, content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          setIsSubmitting(false);
          onSubmit?.(content);
        },
        onError: (error) => {
          console.error("댓글 작성 실패:", error);

          // 입력창 비우기 (에러 발생 시에도)
          setContent("");
          setIsSubmitting(false);

          // 에러 메시지 표시
          const errorMessage = error instanceof Error ? error.message : "댓글 작성에 실패했습니다";

          if (errorMessage.includes("동일한 내용")) {
            toast.showToast({
              type: "error",
              message: "이전 댓글과 다른 내용을 입력해주세요.",
              duration: 3000,
            });
          } else {
            toast.showToast({
              type: "error",
              message: errorMessage,
              duration: 3000,
            });
          }
        },
      }
    );
  }, [feedId, content, onSubmit, createCommentMutation, toast, isSubmitting]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  return (
    <Container>
      <CommentComposer
        variant="create"
        value={content}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={createCommentMutation.isPending || isSubmitting}
        placeholder="댓글을 입력하세요..."
      />
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 12px 16px;
  z-index: 10;
`;
