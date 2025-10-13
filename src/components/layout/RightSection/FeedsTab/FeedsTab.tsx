"use client";

import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import type { SortBy } from "@/types/feeds";
import styled from "styled-components";
import SegmentedControl from "./SegmentedControl";
import ToggleButton from "./ToggleButton";
import useAuth from "@/hooks/useAuth";
import { usePoll } from "@/hooks/usePoll";

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "최신순", value: "created" },
  { label: "좋아요순", value: "like" },
  { label: "댓글순", value: "comment" },
];

export default function FeedsTab() {
  const { sortBy, setSortBy, filterType, setFilterType } = useFeedFilterStore();
  const { isLoggedIn } = useAuth();
  const { data: pollData } = usePoll();

  const itemLabels = SORT_OPTIONS.map((option) => option.label);
  const initialIdx = SORT_OPTIONS.findIndex((option) => option.value === sortBy);

  const handleTabClick = (idx: number) => {
    setSortBy(SORT_OPTIONS[idx].value);
  };

  const handleSquadToggle = (isChecked: boolean) => {
    setFilterType(isChecked ? "same_vote" : "all");
  };

  const isSquadDisabled = !isLoggedIn || !pollData?.hasVoted;

  return (
    <StyledContainer>
      <SegmentedControl
        itemLabels={itemLabels}
        initialIdx={initialIdx}
        onItemClick={handleTabClick}
      />
      <StyledSquad>
        <ToggleButton
          isChecked={filterType === "same_vote"}
          onChange={handleSquadToggle}
          disabled={isSquadDisabled}
        />
      </StyledSquad>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
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
