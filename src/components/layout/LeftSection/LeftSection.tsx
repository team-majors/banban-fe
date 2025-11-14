import RealtimeFeedRanking from "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking";
import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import { media } from "@/constants/breakpoints";
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
  padding-top: 12px;
  padding-bottom: 32px;

  ${media.mobile} {
    width: 100%;
  }

  ${media.desktop} {
    width: 100%;
    flex: 1;
  }

  ${media.desktop} {
    width: 430px;
  }
`;
