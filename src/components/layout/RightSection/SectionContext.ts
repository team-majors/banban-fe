import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Feed } from "@/types/feeds";

export const SectionContext = createContext<{
  sectionStatus: "feeds" | "comments";
  setSectionStatus: Dispatch<SetStateAction<"feeds" | "comments">>;

  targetFeed: Feed | null;
  setTargetFeed: Dispatch<SetStateAction<Feed | null>>;

  inBottomSheet?: boolean;

  // 모바일 전용: 피드 클릭 핸들러 (바텀시트 사용)
  onMobileFeedClick?: (feedId: number) => void;
}>({
  sectionStatus: "feeds",
  setSectionStatus: () => {},

  targetFeed: null,
  setTargetFeed: () => {},

  inBottomSheet: false,
  onMobileFeedClick: undefined,
});