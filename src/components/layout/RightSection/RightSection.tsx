import styled from "styled-components";
import FeedsPanel from "./FeedsPanel";
import { useRef, useContext } from "react";
import { useCalculatedHeight } from "./hooks/useCalculateHeight";
import { CommentsPanel } from "./CommentsPanel";
import { SectionContext } from "./SectionContext";

export default function RightSection() {
  const { sectionStatus } = useContext(SectionContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const calculatedHeight = useCalculatedHeight(containerRef);

  return (
    <StyledContainer $calculatedHeight={calculatedHeight} ref={containerRef}>
      {sectionStatus === "feeds" ? <FeedsPanel /> : <CommentsPanel />}
    </StyledContainer>
  );
}

const StyledContainer = styled.div<{ $calculatedHeight?: number }>`
  width: 430px;
  height: ${(props) =>
    props.$calculatedHeight !== 0 ? `${props.$calculatedHeight}px` : "100%"};

  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex-direction: column;

  background-color: #fff;
  padding: 10px 10px 0 10px;
  border-radius: 8px 8px 0 0;

  margin-top: 16px;

  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15);
`;

