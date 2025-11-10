"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import { media } from "@/constants/breakpoints";
import type { Feed } from "@/types/feeds";
import FloatingButtonWithModal from "@/components/common/FloatingButtonWithModal";
import { useAuthStore } from "@/store/useAuthStore";
import { usePoll } from "@/hooks/usePoll";
import NoTopicState from "@/components/layout/LeftSection/TodayTopicCard/NoTopicState";

export default function DesktopHome() {
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);
  const { isLoggedIn } = useAuthStore();
  const { data: pollData, isLoading: isPollLoading } = usePoll();

  const sectionContextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
    }),
    [sectionStatus, targetFeed],
  );

  // Poll 데이터가 없을 때 (로딩 완료 후)
  if (!isPollLoading && !pollData) {
    return (
      <FullScreenContainer>
        <NoTopicState
          message="오늘의 주제가 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      </FullScreenContainer>
    );
  }

  return (
    <SectionContext.Provider value={sectionContextValue}>
      <ContentContainer>
        <MainContentWrapper>
          <LeftSection />
          <RightSection />

          {/* 메인 화면에서만 피드 작성 플러스 버튼 표시 (투표 완료 시에만) */}
          {isLoggedIn && pollData?.hasVoted && (
            <FloatingButtonWithModal
              sectionStatus="feeds"
              targetFeed={null}
            />
          )}
        </MainContentWrapper>
      </ContentContainer>
    </SectionContext.Provider>
  );
}

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding-top: 60px;

  ${media.tablet} {
    height: 100dvh;
    gap: 16px;
    padding: 60px 24px 0 24px;
  }

  ${media.desktop} {
    height: 100dvh;
    gap: 24px;
    padding: 60px 0 0 0;
  }
`;

const MainContentWrapper = styled.div`
  display: flex;
  gap: 24px;
  width: fit-content;
  height: fit-content;

  ${media.tablet} {
    display: flex;
    gap: 16px;
    width: 100%;
    height: 100%;
  }

  ${media.desktop} {
    display: flex;
    gap: 24px;
    width: fit-content;
    height: fit-content;
  }
`;

const FullScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100dvh;
  background-color: #f8fafc;
`;
