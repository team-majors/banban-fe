"use client";

import { useState } from "react";
import styled from "styled-components";
import { FloatingInputModal } from "@/components/layout/FloatingInputModal";
import { FloatingButton } from "@/components/common/Button/Floating/FloatingButton";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
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
            userId="user123"
            actionType="피드"
          />
        )}
      </div>
    </div>
  );
}

const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;
