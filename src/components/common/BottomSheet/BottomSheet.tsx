"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: number; // vh 단위, 기본값 90
}

const DRAG_VELOCITY_THRESHOLD = 500;
const DRAG_DISTANCE_THRESHOLD = 100;

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  maxHeight = 90,
}: BottomSheetProps) => {
  // 키보드 높이 추적 (px 단위)
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Visual Viewport API로 키보드 높이 감지
  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const handleViewportResize = () => {
      // 전체 화면 높이와 보이는 화면 높이의 차이 = 키보드 높이
      const windowHeight = window.innerHeight;
      const viewportHeight = window.visualViewport!.height;
      const newKeyboardHeight = Math.max(0, windowHeight - viewportHeight);

      setKeyboardHeight(newKeyboardHeight);
    };

    // 초기값 설정
    handleViewportResize();

    // 리스너 등록
    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("scroll", handleViewportResize);
    };
  }, [isOpen]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { velocity: { y: number }; offset: { y: number } },
  ) => {
    const { velocity, offset } = info;

    // 빠르게 아래로 스와이프 또는 충분히 아래로 드래그 → 닫기
    if (velocity.y > DRAG_VELOCITY_THRESHOLD || offset.y > DRAG_DISTANCE_THRESHOLD) {
      onClose();
      return;
    }

    // 가장 가까운 snap point로 이동
    const currentSnap = velocity.y > 0 ? 0.4 : 0.9;
    return currentSnap;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 */}
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          {/* Bottom Sheet */}
          <SheetContainer
            $maxHeight={maxHeight}
            $keyboardHeight={keyboardHeight}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 1,
            }}
            drag="y"
            dragElastic={{ top: 0, bottom: 0.3 }}
            dragConstraints={{ top: 0 }}
            dragMomentum={true}
            onDragEnd={handleDragEnd}
          >
            {/* 드래그 인디케이터 */}
            <DragHandle />

            {/* 컨텐츠 */}
            <Content>{children}</Content>
          </SheetContainer>
        </>
      )}
    </AnimatePresence>
  );
};

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
`;

const SheetContainer = styled(motion.div)<{
  $maxHeight?: number;
  $keyboardHeight?: number;
}>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: ${props => {
    const maxHeightVh = props.$maxHeight || 90;
    const keyboardHeightPx = props.$keyboardHeight || 0;

    // 키보드가 열려있으면 max-height를 조정
    if (keyboardHeightPx > 0) {
      return `calc(${maxHeightVh}vh - ${keyboardHeightPx}px)`;
    }
    return `${maxHeightVh}vh`;
  }};
  background-color: white;
  border-radius: 12px 12px 0 0;
  z-index: 999;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  touch-action: none;
  transition: max-height 0.2s ease;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background-color: #d1d5db;
  border-radius: 2px;
  margin: 12px auto;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 필수: flex 자식이 overflow를 정상 작동하게 함 */
`;
