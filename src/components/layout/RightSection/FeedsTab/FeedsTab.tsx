"use client";

import styled from "styled-components";
import SegmentedControl from "./SegmentedControl";
import ToggleButton from "./ToggleButton";
import { useState } from "react";

export default function FeedsTab() {
  const [isSquadChecked, setIsSquadChecked] = useState(false);

  return (
    <StyledContainer>
      <SegmentedControl itemLabels={["최신순", "좋아요순", "댓글순"]} />
      <StyledSquad>
        <ToggleButton isChecked={isSquadChecked} onChange={setIsSquadChecked} />
      </StyledSquad>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  min-width: 416px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 5px 0 15px 0;
`;

const StyledSquad = styled.div`
  display: flex;
  padding: 4px 16px;

  justify-content: center;
  align-items: center;
`;
