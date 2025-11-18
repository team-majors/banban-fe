"use client";

import DesktopFeedDetailPage from "@/components/layout/FeedDetail/DesktopFeedDetailPage";
import MobileFeedDetailPage from "@/components/mobile/pages/MobileFeedDetailPage";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import { useFeedDetailPageState } from "@/hooks/ui/feedDetail/useFeedDetailPageState";

export default function FeedPage() {
  const { contextValue, isMobile } = useFeedDetailPageState();

  if (isMobile) {
    return (
      <SectionContext.Provider value={contextValue}>
        <MobileFeedDetailPage />
      </SectionContext.Provider>
    );
  }

  return (
    <SectionContext.Provider value={contextValue}>
      <DesktopFeedDetailPage />
    </SectionContext.Provider>
  );
}
