"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSafeMediaQuery } from "@/hooks/useMediaQuery";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import { useFeeds } from "@/hooks/useFeeds";
import type { Feed } from "@/types/feeds";

export function useFeedDetailPageState() {
  const params = useParams();
  const router = useRouter();
  const feedId = Number(params.feedId);

  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);

  const isMobile = useSafeMediaQuery(
    `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
  );

  const { sortBy, filterType } = useFeedFilterStore();

  const shouldLoadList = isMobile || targetFeed === null;
  const { data: listData } = useFeeds(
    { sort_by: sortBy, filter_type: filterType },
    { enabled: shouldLoadList },
  );

  // feedId로 피드 자동 선택
  useEffect(() => {
    if (!feedId || !Number.isFinite(feedId)) return;
    if (targetFeed && targetFeed.id === feedId) return;

    const pages = listData?.pages;
    if (!pages || !Array.isArray(pages)) return;

    let found: Feed | null = null;

    for (const page of pages) {
      const content = page?.data?.content;
      if (!Array.isArray(content)) continue;

      const hit = content.find(
        (item: Feed | unknown): item is Feed =>
          item !== null &&
          typeof item === "object" &&
          "id" in item &&
          (item as Feed).id === feedId,
      );

      if (hit) {
        found = hit;
        break;
      }
    }

    if (found) {
      setTargetFeed(found);
      setSectionStatus("comments");
    }
  }, [feedId, listData?.pages, targetFeed?.id]);

  const contextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
    }),
    [sectionStatus, targetFeed],
  );

  return {
    contextValue: {
      ...contextValue,
      disableFeedsPanel: !isMobile,
    },
    isMobile,
    router,
    feedId,
  };
}
