import RealtimeFeedRankingSkeleton from "@/components/common/Skeleton/RealtimeFeedRankingSkeleton";
import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import { media } from "@/constants/breakpoints";
import { useIdle } from "@/hooks/common/useIdle";
import dynamic from "next/dynamic";
import { useState } from "react";
import styled from "styled-components";

const RealtimeFeedRanking = dynamic(
  () =>
    import(
      "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking"
    ),
  { ssr: false, loading: () => <RealtimeFeedRankingSkeleton /> },
);

export default function LeftSection() {
  const [showRanking, setShowRanking] = useState(false);

  useIdle(() => setShowRanking(true), []);

  return (
    <StyledContainer>
      <TodayTopicCard />
      {showRanking && <RealtimeFeedRanking />}
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
