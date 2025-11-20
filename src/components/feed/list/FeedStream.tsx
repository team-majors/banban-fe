import styled from "styled-components";
import { useFeeds } from "@/hooks/api/feed/useFeeds";
import { useInView } from "react-intersection-observer";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Block } from "../../layout/RightSection/Block";
import useScrollPositionStore from "@/store/useScrollPositionStore";
import { usePoll } from "@/hooks/api/poll/usePoll";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";
import dynamic from "next/dynamic";
import { Feed } from "@/types/feeds";
import CommentThread from "../detail/CommentThread";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";

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

type FeedPages = ReturnType<typeof useFeeds>["data"];

function useFeedSelection(
  data: FeedPages,
  setTargetFeed: (feed: Feed | null) => void,
  setSectionStatus: (status: "feeds" | "comments") => void,
) {
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);

  const selectedFeed = useMemo(() => {
    if (!selectedFeedId || !data) return null;

    let found: Feed | null = null;
    data.pages?.some((page) => {
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
  }, [selectedFeedId, data]);

  const openBottomSheet = useCallback((feedId: number) => {
    setSelectedFeedId(feedId);
    if (typeof window !== "undefined") {
      window.history.pushState({ bottomSheet: true }, "");
    }
  }, []);

  const closeBottomSheet = useCallback(() => {
    setSelectedFeedId(null);
    setTargetFeed(null);
    setSectionStatus("feeds");
  }, [setSectionStatus, setTargetFeed]);

  useEffect(() => {
    if (!selectedFeed) return;
    setTargetFeed(selectedFeed);
    setSectionStatus("comments");
  }, [selectedFeed, setSectionStatus, setTargetFeed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      if (selectedFeedId !== null) {
        closeBottomSheet();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [closeBottomSheet, selectedFeedId]);

  return { selectedFeedId, selectedFeed, openBottomSheet, closeBottomSheet };
}

function useScrollRestoration({
  scrollRef,
  scrollKey,
  dataLength,
  getPosition,
  setPosition,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollKey: string;
  dataLength: number;
  getPosition: (key: string) => number;
  setPosition: (key: string, value: number) => void;
}) {
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const stored = getPosition(scrollKey);
    if (stored <= 0) return;
    container.scrollTo(0, stored);
  }, [getPosition, scrollKey, dataLength, scrollRef]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeoutId: number | undefined;

    const handleScroll = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        setPosition(scrollKey, container.scrollTop || 0);
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      setPosition(scrollKey, container.scrollTop || 0);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollKey, setPosition, scrollRef]);
}

function usePrefetchOnInView({
  enabled,
  hasNextPage,
  isInView,
  fetchNextPage,
}: {
  enabled: boolean;
  hasNextPage?: boolean;
  isInView: boolean;
  fetchNextPage: () => void;
}) {
  useEffect(() => {
    if (!enabled || !hasNextPage || !isInView) return;

    const timeoutId = setTimeout(() => {
      fetchNextPage();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [enabled, hasNextPage, isInView, fetchNextPage]);
}

export default function FeedStream() {
  const { sortBy, filterType } = useFeedFilterStore();
  const { data: todayPoll, isLoading: isPollLoading } = usePoll();
  const pollId = todayPoll?.id;

  const feedsEnabled = typeof pollId === "number";

  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);

  const feedsQuery = useFeeds(
    {
      sort_by: sortBy,
      filter_type: filterType,
      poll_id: pollId,
    },
    {
      enabled: feedsEnabled,
    },
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFeedsLoading,
  } = feedsQuery;

  const { selectedFeedId, selectedFeed, openBottomSheet, closeBottomSheet } =
    useFeedSelection(data, setTargetFeed, setSectionStatus);

  useEffect(() => {
    if (!selectedFeed) return;
    setTargetFeed(selectedFeed);
    setSectionStatus("comments");
  }, [selectedFeed, setSectionStatus, setTargetFeed]);

  const [scrollTrigger, isInView] = useInView({
    threshold: 0,
    rootMargin: "200px", // 200px 전에 미리 로드 (부드러운 UX)
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { getPosition, setPosition } = useScrollPositionStore();
  const scrollKey = `feeds:${sortBy}:${filterType}`;

  usePrefetchOnInView({
    enabled: feedsEnabled,
    hasNextPage,
    isInView,
    fetchNextPage,
  });

  useScrollRestoration({
    scrollRef,
    scrollKey,
    dataLength: data?.pages?.length ?? 0,
    getPosition,
    setPosition,
  });

  const sectionContextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
      onDesktopFeedClick: openBottomSheet,
    }),
    [sectionStatus, targetFeed, openBottomSheet],
  );

  const isLoading = isPollLoading || (feedsEnabled && isFeedsLoading);
  const hasData =
    feedsEnabled && data?.pages?.length && data.pages[0]?.data?.content?.length;

  return (
    <SectionContext.Provider value={sectionContextValue}>
      <StyledFeedStreamContainer ref={scrollRef}>
        {isLoading ? (
          <StatusNotice>피드를 불러오는 중입니다...</StatusNotice>
        ) : hasData ? (
          <>
            {data.pages?.map((page, index) => (
              <Fragment key={`page-${index}`}>
                {page?.data?.content?.map((item, idx, array) => {
                  const isSecondFromLast = idx === array.length - 4;
                  const itemKey =
                    item.type === "AD"
                      ? `ad-${item.id}-${idx}`
                      : `feed-${item.id}`;

                  return (
                    <Fragment key={itemKey}>
                      {isSecondFromLast && hasNextPage && (
                        <div ref={scrollTrigger} />
                      )}
                      {item.type === "USER" || item.type === "NOTICE" ? (
                        <Block
                          type="feed"
                          feedProps={item}
                          pollData={todayPoll}
                        />
                      ) : (
                        <Block
                          type="ad"
                          feedProps={item}
                          pollData={todayPoll}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </Fragment>
            ))}
            <div className="flex h-30 items-center justify-center">
              {isFetchingNextPage ? (
                <StatusNotice $compact>
                  추가 피드를 불러오는 중입니다...
                </StatusNotice>
              ) : (
                <StatusNotice $muted $compact>
                  {hasNextPage ? "" : "불러올 피드가 없습니다"}
                </StatusNotice>
              )}
            </div>
          </>
        ) : (
          <StatusNotice>불러올 피드가 없습니다</StatusNotice>
        )}

        {/* 바텀시트 - 피드 댓글 표시 */}
        {selectedFeedId && selectedFeed && (
          <DynamicBottomSheet
            isOpen={true}
            onClose={closeBottomSheet}
            maxHeight={90}
          >
            <CommentThread />
          </DynamicBottomSheet>
        )}
      </StyledFeedStreamContainer>
    </SectionContext.Provider>
  );
}

const StyledFeedStreamContainer = styled.div`
  height: 100%;

  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > :first-child {
    margin-top: 10px;
  }
`;

const StatusNotice = styled.div<{ $muted?: boolean; $compact?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: ${({ $compact }) => ($compact ? "auto" : "240px")};
  padding: ${({ $compact }) => ($compact ? "0" : "32px 16px")};
  font-size: ${({ $compact }) => ($compact ? "12px" : "15px")};
  font-weight: 500;
  color: ${({ $muted }) => ($muted ? "#9ca3af" : "#6b7280")};
  text-align: center;
  white-space: pre-line;
`;
