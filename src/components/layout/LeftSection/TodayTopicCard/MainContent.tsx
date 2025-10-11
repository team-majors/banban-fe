import React from "react";
import styled from "styled-components";
import VoteResultCircle, { PieData } from "./chart/VoteResultCircle";
import { Option } from "./TodayTopicCard";
import {
  selectOption,
  SelectOptionGroup,
} from "@/components/common/SelectOptionGroup/SelectOptionGroup";
import CountdownDisplay from "./CountdownDisplay";
import VoteResultPlaceHolder from "./VoteResultPlaceHolder/VoteResultPlaceHolder";
import { useAuthStore } from "@/store/useAuthStore";

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
}: {
  pieData: PieData[];
  votedOptionId: number | null | undefined;
  options?: Option[];
  displayedSelection: selectOption;
  handleVote: (selection: selectOption) => void;
}) {
  return (
    <>
      <VoteResultCircleContainer>
        <VoteResultDisplay pieData={pieData} votedOptionId={votedOptionId} />
      </VoteResultCircleContainer>
      <CountdownDisplay />
      <SelectOptionGroup
        selected={displayedSelection}
        rowGap="10px"
        firstOptionString={options?.[0]?.content || ""}
        secondOptionString={options?.[1]?.content || ""}
        onClick={handleVote}
        isAuthenticated={isLoggedIn}
      />
    </>
  );
}

const VoteResultCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 248px;
  max-height: 280px;
`;
