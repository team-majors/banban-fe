"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import type { Feed } from "@/types/feeds";
import { useFeeds } from "@/hooks/useFeeds";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";

export default function FeedPage() {
  const params = useParams();
  const feedId = Number(params.feedId);
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">("feeds");
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);
  const { sortBy, filterType } = useFeedFilterStore();
  const { data } = useFeeds({
    sort_by: sortBy,
    filter_type: filterType,
  });

  // feedId로 해당 피드를 찾아서 댓글 화면 자동 오픈
  useEffect(() => {
    if (!feedId || !Number.isFinite(feedId) || !data) return;

    let found: Feed | null = null;
    data.pages?.some((page) => {
      const hit = page?.data?.content?.find((item: Feed) => item?.id === feedId);
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
