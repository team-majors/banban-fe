"use client";

import { useState, useCallback } from "react";
import styled from "styled-components";
import { media } from "@/constants/breakpoints";
import { FloatingInputModal } from "@/components/layout/FloatingInputModal";
import { FloatingButton } from "@/components/common/Button/Floating/FloatingButton";
import type { Feed } from "@/types/feeds";
import { useFloatingModalStore } from "@/store/useFloatingModalStore";

interface FloatingButtonWithModalProps {
  sectionStatus: "feeds" | "comments";
  targetFeed: Feed | null;
}

export default function FloatingButtonWithModal({
  sectionStatus,
  targetFeed,
}: FloatingButtonWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAnyModalOpen = useFloatingModalStore((state) => state.isFloatingModalOpen);

  const handleToggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback((content: string) => {
    console.log("Submitted content:", content);
    setIsModalOpen(false);
  }, []);

  const actionType = sectionStatus === "comments" ? "댓글" : "피드";

  // 자체 모달이 열려있거나 외부에서 모달이 열려있으면 버튼 숨김
  const shouldHideButton = isModalOpen || isAnyModalOpen;

  return (
    <>
      <FloatingButtonContainer $isHidden={shouldHideButton}>
        <FloatingButton
          state={isModalOpen ? "close" : "add"}
          onToggle={handleToggleModal}
        />
      </FloatingButtonContainer>

      {isModalOpen && (
        <FloatingInputModal
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          actionType={actionType}
          feedId={targetFeed?.id}
        />
      )}
    </>
  );
}

const FloatingButtonContainer = styled.div<{ $isHidden?: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  opacity: ${({ $isHidden }) => ($isHidden ? "0" : "1")};
  pointer-events: ${({ $isHidden }) => ($isHidden ? "none" : "auto")};
  transition: opacity 0.2s ease;

  ${media.mobile} {
    bottom: 80px; /* 하단 탭바(64px) + 여유(16px) */
    right: 16px;
  }
`;
