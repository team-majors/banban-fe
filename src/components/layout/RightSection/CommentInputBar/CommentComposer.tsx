import { useCallback, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import styled from "styled-components";

type ComposerVariant = "create" | "edit";

interface CommentComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
  variant?: ComposerVariant;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  placeholder = "댓글을 입력하세요...",
  variant = "create",
  autoFocus = false,
  disabled = false,
}: CommentComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEdit = variant === "edit";
  const trimmedValue = value.trim();
  const isActionDisabled = disabled || !trimmedValue || isSubmitting;

  const handleResize = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    const maxHeight = 120;
    const nextHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
    textareaRef.current.style.height = `${nextHeight}px`;
  }, []);

  useEffect(() => {
    handleResize();
  }, [value, handleResize]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(value.length, value.length);
    }
  }, [autoFocus, value.length]);

  // 키보드 열릴 때 입력창이 보이도록 스크롤 처리
  useEffect(() => {
    if (!textareaRef.current) return;

    const handleFocus = () => {
      // 짧은 딜레이 후 스크롤 (키보드 애니메이션 고려)
      setTimeout(() => {
        textareaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 300);
    };

    const textarea = textareaRef.current;
    textarea.addEventListener("focus", handleFocus);

    return () => {
      textarea.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!isActionDisabled) onSubmit();
      }
      if (event.key === "Escape" && onCancel) {
        event.preventDefault();
        onCancel();
      }
    },
    [isActionDisabled, onSubmit, onCancel],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <ComposerContainer $variant={variant}>
      {isEdit && (
        <EditBanner>
          <EditMarker>댓글 수정 중</EditMarker>
        </EditBanner>
      )}
      <ComposerBody $variant={variant}>
        <StyledTextarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={isEdit ? 3 : 1}
          aria-label={isEdit ? "댓글 수정" : "댓글 작성"}
          $variant={variant}
          disabled={disabled}
        />
        {isEdit ? (
          <EditActions>
            {onCancel && (
              <SecondaryButton
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                취소
              </SecondaryButton>
            )}
            <PrimaryButton
              type="button"
              onClick={onSubmit}
              disabled={isActionDisabled}
            >
              {isSubmitting ? "수정 중..." : "수정 완료"}
            </PrimaryButton>
          </EditActions>
        ) : (
          <IconButton
            type="button"
            onClick={onSubmit}
            disabled={isActionDisabled}
            aria-label="댓글 작성"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 20V4L22 12L3 20ZM5 17L16.85 12L5 7V10.5L11 12L5 13.5V17Z"
                fill="currentColor"
              />
            </svg>
          </IconButton>
        )}
      </ComposerBody>
    </ComposerContainer>
  );
}

const ComposerContainer = styled.div<{ $variant: ComposerVariant }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $variant }) => ($variant === "edit" ? "12px" : "8px")};
  width: 100%;
`;

const ComposerBody = styled.div<{ $variant: ComposerVariant }>`
  display: flex;
  flex-direction: ${({ $variant }) => ($variant === "edit" ? "column" : "row")};
  align-items: ${({ $variant }) =>
    $variant === "edit" ? "stretch" : "flex-end"};
  gap: ${({ $variant }) => ($variant === "edit" ? "12px" : "8px")};
`;

const StyledTextarea = styled.textarea<{ $variant: ComposerVariant }>`
  flex: 1;
  resize: none;
  border: 1px solid
    ${({ $variant }) => ($variant === "edit" ? "#c4b5fd" : "#e2e8f0")};
  border-radius: ${({ $variant }) => ($variant === "edit" ? "12px" : "20px")};
  padding: 10px 16px;
  font-size: 14px;
  line-height: 20px;
  font-family: inherit;
  outline: none;
  max-height: 120px;
  overflow-y: auto;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: ${({ $variant }) =>
    $variant === "edit" ? "#faf5ff" : "#ffffff"};

  &:focus {
    border-color: #3f13ff;
    box-shadow: 0 0 0 3px rgba(63, 19, 255, 0.12);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox 스크롤바 숨기기 */
  scrollbar-width: none;

  /* IE (구버전) 스크롤바 숨기기 */
  -ms-overflow-style: none;

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
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

const EditBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5b21b6;
  font-size: 13px;
  font-weight: 600;
`;

const EditMarker = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: rgba(63, 19, 255, 0.08);
  border-radius: 999px;
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const PrimaryButton = styled.button`
  min-width: 80px;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #3f13ff;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: #3209e0;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #3f13ff;
    outline-offset: 2px;
  }
`;

const SecondaryButton = styled.button`
  min-width: 80px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #94a3b8;
  }

  &:disabled {
    color: #94a3b8;
    border-color: #e2e8f0;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #3f13ff;
    outline-offset: 2px;
  }
`;
