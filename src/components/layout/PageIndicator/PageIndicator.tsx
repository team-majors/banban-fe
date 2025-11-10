"use client";

import styled from "styled-components";
import { media } from "@/constants/breakpoints";

interface PageIndicatorProps {
  currentPage: "poll" | "feeds";
}

export default function PageIndicator({ currentPage }: PageIndicatorProps) {
  return (
    <Container>
      <Bar $isActive={currentPage === "poll"} />
      <Bar $isActive={currentPage === "feeds"} />
    </Container>
  );
}

const Container = styled.div`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #f1f5f9;
  z-index: 899;
  gap: 6px;
  padding: 0 6px;

  ${media.mobile} {
    display: flex;
  }
`;

const Bar = styled.div<{ $isActive: boolean }>`
  flex: 1;
  height: 100%;
  border-radius: 12px;
  background-color: ${(props) =>
    props.$isActive ? "#3f13ff" : "rgba(63, 19, 255, 0.2)"};
  transition: background-color 0.3s ease;
`;
