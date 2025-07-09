"use client";

import styled from "styled-components";
import SegmentedControl from "./SegmentedControl";

export default function FeedsTab() {
  return (
    <StyledContainer>
      <SegmentedControl itemLabels={["최신순", "좋아요순", "댓글순"]} />
      <StyledSquad>
        <div>Squad</div>
      </StyledSquad>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  min-width: 416px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

const StyledSquad = styled.div`
  display: flex;
  padding: 4px 16px;

  justify-content: center;
  align-items: center;
`;
