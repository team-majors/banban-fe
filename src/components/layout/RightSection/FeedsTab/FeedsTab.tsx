"use client";

import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import type { SortBy } from "@/types/feeds";
import styled from "styled-components";
import SegmentedControl from "./SegmentedControl";
import FilterChip from "./FilterChip";
import useAuth from "@/hooks/auth/useAuth";
import { usePoll } from "@/hooks/api/poll/usePoll";

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
  const initialIdx = SORT_OPTIONS.findIndex(
    (option) => option.value === sortBy,
  );

  const handleTabClick = (idx: number) => {
    setSortBy(SORT_OPTIONS[idx].value);
  };

  const handleSquadToggle = () => {
    setFilterType(filterType === "same_vote" ? "all" : "same_vote");
  };

  const isSquadDisabled = !isLoggedIn || !pollData?.hasVoted;

  return (
    <StyledContainer>
      <SegmentedControl
        itemLabels={itemLabels}
        initialIdx={initialIdx}
        onItemClick={handleTabClick}
      />
      <FilterChip
        active={filterType === "same_vote"}
        onClick={handleSquadToggle}
        disabled={isSquadDisabled}
      />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 8px;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  -ms-overflow-style: none;
`;
