"use client";

import { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { useCreateComment } from "@/hooks/useCreateComment";

interface CommentInputBarProps {
  feedId: number;
  onSubmit?: (content: string) => void;
}

export default function CommentInputBar({ feedId, onSubmit }: CommentInputBarProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createCommentMutation = useCreateComment();

  const handleSubmit = useCallback(() => {
    if (!content.trim() || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      { feedId, content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
          onSubmit?.(content);
        },
        onError: (error) => {
          console.error("댓글 작성 실패:", error);
          alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  }, [feedId, content, onSubmit, createCommentMutation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, []);

  return (
    <Container>
      <InputWrapper>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요..."
          rows={1}
        />
        <SubmitButton
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || createCommentMutation.isPending}
          aria-label="댓글 작성"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17Z"
              fill="currentColor"
            />
          </svg>
        </SubmitButton>
      </InputWrapper>
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

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const Textarea = styled.textarea`
  flex: 1;
  resize: none;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 20px;
  font-family: inherit;
  outline: none;
  max-height: 120px;
  overflow-y: auto;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3f13ff;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 999px;
  }
`;

const SubmitButton = styled.button`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #3f13ff;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #3209e0;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #3f13ff;
    outline-offset: 2px;
  }
`;
