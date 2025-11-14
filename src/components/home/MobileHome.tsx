"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import HomeTab from "@/components/mobile/tabs/HomeTab";
import FeedTab from "@/components/mobile/tabs/FeedTab";
import BottomTabBar, { type TabType } from "@/components/mobile/BottomTabBar";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import type { Feed } from "@/types/feeds";
import FloatingButtonWithModal from "@/components/common/FloatingButtonWithModal";
import { useAuthStore } from "@/store/useAuthStore";
import { usePoll } from "@/hooks/usePoll";
import NoTopicState from "@/components/layout/LeftSection/TodayTopicCard/NoTopicState";
import { useNotifications } from "@/hooks/useNotifications";
import { useFeeds } from "@/hooks/useFeeds";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import NeutralSkeleton from "@/components/common/Skeleton/NeutralSkeleton";
import RightSection from "@/components/layout/RightSection/RightSection";

const TabPlaceholder = () => (
  <div className="flex flex-col gap-3 p-4">
    <NeutralSkeleton height="16px" />
    <NeutralSkeleton height="16px" width="80%" />
    <NeutralSkeleton height="200px" />
  </div>
);

const NotificationsPage = dynamic(
  () => import("@/components/mobile/pages/NotificationsPage"),
  {
    ssr: false,
    loading: () => <TabPlaceholder />,
  },
);

const ProfilePage = dynamic(
  () => import("@/components/mobile/pages/ProfilePage"),
  {
    ssr: false,
    loading: () => <TabPlaceholder />,
  },
);

const DynamicBottomSheet = dynamic(
  () =>
    import("@/components/common/BottomSheet/BottomSheet").then(
      (mod) => mod.BottomSheet,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function MobileHome() {
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);

  // 탭 상태 복원 (sessionStorage에서)
  const [mobileActiveTab, setMobileActiveTab] = useState<TabType>(() => {
    // SSR 안전하게 처리
    if (typeof window === "undefined") return "home";

    const savedTab = sessionStorage.getItem("mobileActiveTab");
    if (
      savedTab &&
      ["home", "feeds", "notifications", "profile"].includes(savedTab)
    ) {
      return savedTab as TabType;
    }
    return "home";
  });

  // 바텀시트 상태 (피드 클릭용)
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);

  const { isLoggedIn } = useAuthStore();
  const { data: pollData, isLoading: isPollLoading } = usePoll();

  // 알림 데이터 (읽지 않은 알림 개수 확인용)
  const { data: notificationsData } = useNotifications({ enabled: isLoggedIn });
  const unreadCount = notificationsData?.pages[0]?.data.unreadCount ?? 0;

  // 피드 목록 가져오기 (바텀시트에서 선택된 피드 찾기용)
  const { sortBy, filterType } = useFeedFilterStore();
  const { data: feedsData } = useFeeds({
    sort_by: sortBy,
    filter_type: filterType,
  });

  // 선택된 피드 찾기
  const selectedFeed = useMemo(() => {
    if (!selectedFeedId || !feedsData) return null;

    let found: Feed | null = null;
    feedsData.pages?.some((page) => {
      const hit = page?.data?.content?.find(
        (item: Feed) => item?.id === selectedFeedId,
      );
      if (hit) {
        found = hit;
        return true;
      }
      return false;
    });

    return found;
  }, [selectedFeedId, feedsData]);

  // 선택된 피드가 변경되면 targetFeed 업데이트
  useEffect(() => {
    if (!selectedFeed) return;
    setTargetFeed(selectedFeed);
    setSectionStatus("comments");
  }, [selectedFeed, setSectionStatus, setTargetFeed]);

  // 모바일 피드 클릭 핸들러 (바텀시트 열기)
  const handleMobileFeedClick = useCallback((feedId: number) => {
    setSelectedFeedId(feedId);
    // 브라우저 히스토리에 상태 추가 (뒤로가기 처리용)
    window.history.pushState({ bottomSheet: true }, "");
  }, []);

  // 바텀시트 닫기
  const handleCloseBottomSheet = useCallback(() => {
    setSelectedFeedId(null);
    setTargetFeed(null);
    setSectionStatus("feeds");
  }, []);

  // 브라우저 뒤로가기 처리
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 바텀시트가 열려있을 때 뒤로가기를 누르면 바텀시트만 닫기
      if (selectedFeedId !== null) {
        event.preventDefault();
        handleCloseBottomSheet();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedFeedId, handleCloseBottomSheet]);

  // 탭 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mobileActiveTab", mobileActiveTab);
    }
  }, [mobileActiveTab]);

  const sectionContextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
      onMobileFeedClick: handleMobileFeedClick,
    }),
    [sectionStatus, targetFeed, handleMobileFeedClick],
  );

  // Poll 데이터가 없을 때 (로딩 완료 후)
  if (!isPollLoading && !pollData) {
    return (
      <div className="flex items-center justify-center w-screen h-dvh bg-[#f8fafc]">
        <NoTopicState
          message="오늘의 주제가 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      </div>
    );
  }

  return (
    <SectionContext.Provider value={sectionContextValue}>
      <div className="flex justify-center w-full mx-auto pt-16 pb-16 h-dvh overflow-hidden">
        <div className="block w-full max-w-full h-full overflow-y-auto scrollbar-hide">
          {mobileActiveTab === "home" && <HomeTab />}
          {mobileActiveTab === "feeds" && <FeedTab />}
          {mobileActiveTab === "notifications" && <NotificationsPage />}
          {mobileActiveTab === "profile" && <ProfilePage />}

          {/* 피드 탭에서만 피드 작성 플러스 버튼 표시 (투표 완료 시에만) */}
          {isLoggedIn && pollData?.hasVoted && mobileActiveTab === "feeds" && (
            <FloatingButtonWithModal sectionStatus="feeds" targetFeed={null} />
          )}
        </div>
      </div>
      <BottomTabBar
        activeTab={mobileActiveTab}
        onTabChange={setMobileActiveTab}
        hasUnreadNotifications={unreadCount > 0}
      />

      {/* 바텀시트 - 피드 댓글 표시 */}
      {selectedFeedId && selectedFeed && (
        <DynamicBottomSheet
          isOpen={true}
          onClose={handleCloseBottomSheet}
          maxHeight={95}
        >
          <RightSection />
        </DynamicBottomSheet>
      )}
    </SectionContext.Provider>
  );
}
