import { OptionsDropdown } from "@/components/common/OptionsDropdown/OptionsDropdown";
import { UserMenu } from "@/components/common/UserMenu/UserMenu";
import RealtimeFeedRanking from "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking";
import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import styled from "styled-components";

export default function LeftSection() {
  return (
    <StyledContainer>
      <TodayTopicCard />
      <RealtimeFeedRanking />
      <OptionsDropdown onHide={() => {}} onReport={() => {}} />
      <UserMenu />
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
