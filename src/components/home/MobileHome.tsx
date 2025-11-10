"use client";

import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import PageIndicator from "@/components/layout/PageIndicator/PageIndicator";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import type { Feed } from "@/types/feeds";
import FloatingButtonWithModal from "@/components/common/FloatingButtonWithModal";
import { useAuthStore } from "@/store/useAuthStore";
import { usePoll } from "@/hooks/usePoll";
import NoTopicState from "@/components/layout/LeftSection/TodayTopicCard/NoTopicState";

export default function MobileHome() {
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<"poll" | "feeds">(
    "poll",
  );
  const swipeRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuthStore();
  const { data: pollData, isLoading: isPollLoading } = usePoll();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (mobileActiveTab === "poll") {
        setMobileActiveTab("feeds");
      }
    },
    onSwipedRight: () => {
      if (mobileActiveTab === "feeds") {
        setMobileActiveTab("poll");
      }
    },
    trackMouse: false,
  });

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
      <PageIndicator currentPage={mobileActiveTab} />
      <ContentContainer {...swipeHandlers} ref={swipeRef}>
        <MainContentWrapper>
          {mobileActiveTab === "poll" && <LeftSection />}
          {mobileActiveTab === "feeds" && <RightSection />}

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
  padding-top: 64px;
  height: 100dvh;
  overflow: hidden;
`;

const MainContentWrapper = styled.div`
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const FullScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100dvh;
  background-color: #f8fafc;
`;
