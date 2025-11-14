"use client";

import DesktopFeedPage from "@/components/layout/FeedDetail/DesktopFeedPage";
import MobileFeedPage from "@/components/layout/FeedDetail/MobileFeedPage";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import { useFeedDetailPageState } from "@/hooks/useFeedDetailPageState";

export default function FeedPage() {
  const { contextValue, isMobile } = useFeedDetailPageState();

  if (isMobile) {
    return (
      <SectionContext.Provider value={contextValue}>
        <MobileFeedPage />
      </SectionContext.Provider>
    );
  }

  return (
    <SectionContext.Provider value={contextValue}>
      <DesktopFeedPage />
    </SectionContext.Provider>
  );
}
