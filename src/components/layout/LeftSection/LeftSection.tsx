import RealtimeFeedRanking from "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking";
import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import React from "react";
import styled from "styled-components";

export default function LeftSection() {
  return (
    <StyledContainer>
      <TodayTopicCard />
      <RealtimeFeedRanking />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  padding-bottom: 32px;
`;
