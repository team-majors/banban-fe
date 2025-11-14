"use client";

import styled from "styled-components";
import { media } from "@/constants/breakpoints";
import { useRef } from "react";
import { useCalculatedHeight } from "./hooks/useCalculateHeight";
import { SectionContext } from "./SectionContext";
import { useContext } from "react";

export default function RightSectionShell({ children }: { children: React.ReactNode }) {
  const { inBottomSheet } = useContext(SectionContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatedHeight = useCalculatedHeight(containerRef);

  return (
    <StyledContainer
      $calculatedHeight={calculatedHeight}
      $inBottomSheet={inBottomSheet}
      ref={containerRef}
    >
      {children}
    </StyledContainer>
  );
}

const StyledContainer = styled.div<{
  $calculatedHeight?: number;
  $inBottomSheet?: boolean;
}>`
  flex: ${(props) => (props.$inBottomSheet ? "1" : "initial")};
  height: ${(props) => {
    if (props.$inBottomSheet) return "unset";
    return props.$calculatedHeight !== 0
      ? `${props.$calculatedHeight}px`
      : "100%";
  }};
  min-height: ${(props) => (props.$inBottomSheet ? "0" : "auto")};

  overflow: ${(props) => (props.$inBottomSheet ? "visible" : "scroll")};
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex-direction: column;

  background-color: #fff;
  padding: ${(props) => (props.$inBottomSheet ? "0" : "10px 10px 0 10px")};
  border-radius: ${(props) => (props.$inBottomSheet ? "0" : "8px 8px 0 0")};
  margin-top: ${(props) => (props.$inBottomSheet ? "0" : "12px")};

  ${media.mobile} {
    width: 100%;
  }

  ${media.desktop} {
    width: 430px;
  }
`;
