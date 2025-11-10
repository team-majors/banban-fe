"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import type { Feed } from "@/types/feeds";
import { useFeeds } from "@/hooks/useFeeds";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import { BREAKPOINTS } from "@/constants/breakpoints";
import dynamic from "next/dynamic";
const BottomSheet = dynamic(
  () =>
    import("@/components/common/BottomSheet/BottomSheet").then(
      (mod) => mod.BottomSheet,
    ),
  { ssr: false },
);

export default function FeedPage() {
  const params = useParams();
  const router = useRouter();
  const feedId = Number(params.feedId);
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { sortBy, filterType } = useFeedFilterStore();
  const { data } = useFeeds({
    sort_by: sortBy,
    filter_type: filterType,
  });

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // feedId로 해당 피드를 찾아서 댓글 화면 자동 오픈
  useEffect(() => {
    if (!feedId || !Number.isFinite(feedId) || !data) return;

    let found: Feed | null = null;
    data.pages?.some((page) => {
      const hit = page?.data?.content?.find(
        (item: Feed) => item?.id === feedId,
      );
      if (hit) {
        found = hit;
        return true;
      }
      return false;
    });

    if (found) {
      setTargetFeed(found);
      setSectionStatus("comments");
    }
  }, [feedId, data]);

  const sectionContextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
    }),
    [sectionStatus, targetFeed],
  );

  // 모바일: Bottom Sheet로 피드 상세 표시 (배경에 피드 리스트 표시)
  if (isMobile) {
    // 배경: 피드 목록을 보여주는 컨텍스트
    const backgroundContextValue = {
      sectionStatus: "feeds" as const,
      setSectionStatus,
      targetFeed: null,
      setTargetFeed,
    };

    // 포어그라운드: 선택된 피드의 댓글을 보여주는 컨텍스트
    const bottomSheetContextValue = {
      ...sectionContextValue,
      inBottomSheet: true,
    };

    return (
      <>
        {/* 배경: 피드 리스트 */}
        <SectionContext.Provider value={backgroundContextValue}>
          <MobileBackgroundContainer>
            <RightSection />
            {/* 홈으로 가기 버튼 */}
            <HomeButton onClick={() => router.push("/")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="9 22 9 12 15 12 15 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>홈으로</span>
            </HomeButton>
          </MobileBackgroundContainer>
        </SectionContext.Provider>

        {/* 포어그라운드: Bottom Sheet 댓글 */}
        <SectionContext.Provider value={bottomSheetContextValue}>
          <BottomSheet
            isOpen={true}
            onClose={() => router.back()}
            maxHeight={95}
          >
            <RightSection />
          </BottomSheet>
        </SectionContext.Provider>
      </>
    );
  }

  // 데스크톱: 기존 레이아웃
  return (
    <SectionContext.Provider value={sectionContextValue}>
      <div className="relative mx-auto w-fit">
        <div className="flex gap-6 pt-[60px] h-[100dvh]">
          <LeftSection />
          <RightSection />
        </div>
      </div>
    </SectionContext.Provider>
  );
}

const MobileBackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100dvh;
  z-index: 1;
  padding-top: 64px;
  overflow: hidden;
`;

const HomeButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #3f13ff;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 19, 255, 0.3);
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3310dd;
    box-shadow: 0 6px 16px rgba(63, 19, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
