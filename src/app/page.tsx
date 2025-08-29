"use client";

import { useState } from "react";
import styled from "styled-components";
import { FloatingInputModal } from "@/components/layout/FloatingInputModal";
import { FloatingButton } from "@/components/common/Button/Floating/FloatingButton";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import type { Feed } from "@/types/feeds";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">("feeds");
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (content: string) => {
    console.log("Submitted content:", content);
    setIsModalOpen(false);
  };

  // 현재 섹션 상태에 따라 actionType 결정
  const getActionType = () => {
    return sectionStatus === "comments" ? "댓글" : "피드";
  };

  const sectionContextValue = {
    sectionStatus,
    setSectionStatus,
    targetFeed,
    setTargetFeed,
  };

  return (
    <SectionContext.Provider value={sectionContextValue}>
      <div className="relative mx-auto w-fit">
        <div className="flex gap-6 pt-[64px] h-[100dvh]">
          <LeftSection />
          <RightSection />

          <FloatingButtonContainer>
            <FloatingButton
              state={isModalOpen ? "close" : "add"}
              onToggle={handleToggleModal}
            />
          </FloatingButtonContainer>

          {isModalOpen && (
            <FloatingInputModal
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              actionType={getActionType()}
              feedId={targetFeed?.id}
            />
          )}
        </div>
      </div>
    </SectionContext.Provider>
  );
}

const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;
