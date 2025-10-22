import React from "react";
import styled from "styled-components";
import VoteResultCircle, { PieData } from "./chart/VoteResultCircle";
import {
  selectOption,
  SelectOptionGroup,
} from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import CountdownDisplay from "./CountdownDisplay";
import VoteResultPlaceHolder from "./VoteResultPlaceHolder/VoteResultPlaceHolder";
import { PollOption } from "@/types/poll";

function VoteResultDisplay({
  pieData,
  votedOptionId,
}: {
  pieData: PieData[];
  votedOptionId: number | null | undefined;
}) {
  if (votedOptionId == null) {
    return <VoteResultPlaceHolder />;
  }
  return pieData.length > 0 ? <VoteResultCircle pieData={pieData} /> : null;
}

export default function MainContent({
  pieData,
  votedOptionId,
  options,
  displayedSelection,
  handleVote,
  isLoggedIn,
}: {
  pieData: PieData[];
  votedOptionId: number | null | undefined;
  options?: PollOption[];
  displayedSelection: selectOption;
  handleVote: (selection: selectOption) => void;
  isLoggedIn: boolean;
}) {
  const firstOptionString = options?.find(
    (option) => option.optionOrder === 1,
  )?.content;
  const secondOptionString = options?.find(
    (option) => option.optionOrder === 2,
  )?.content;

  return (
    <>
      <VoteResultCircleContainer>
        <VoteResultDisplay pieData={pieData} votedOptionId={votedOptionId} />
      </VoteResultCircleContainer>
      <CountdownDisplay />
      <SelectOptionGroup
        selected={displayedSelection}
        rowGap="10px"
        firstOptionString={firstOptionString || ""}
        secondOptionString={secondOptionString || ""}
        onClick={handleVote}
        isAuthenticated={isLoggedIn}
      />
    </>
  );
}

const VoteResultCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  max-height: 280px;
`;
