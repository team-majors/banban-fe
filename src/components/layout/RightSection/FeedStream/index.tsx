import styled from "styled-components";
import { useFeeds } from "@/hooks/useFeeds";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect, useRef } from "react";
import { Block } from "../Block";
import useScrollPositionStore from "@/store/useScrollPositionStore";
import { usePoll } from "@/hooks/usePoll";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";

export default function FeedStream() {
  const { sortBy, filterType } = useFeedFilterStore();
  const {
    data: todayPoll,
    isLoading: isPollLoading,
    isError: isPollError,
  } = usePoll();
  const pollId = todayPoll?.id;

  const feedsEnabled = typeof pollId === "number";

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

  const [scrollTrigger, isInView] = useInView({
    threshold: 0,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollPosition, setScrollPosition } = useScrollPositionStore();

  useEffect(() => {
    if (!feedsEnabled) return;
    if (hasNextPage && isInView) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, feedsEnabled, fetchNextPage]);

  useEffect(() => {
    if (scrollPosition > 0) {
      scrollRef.current?.scrollTo(0, scrollPosition);
    }

    const handleScrollEnd = () => {
      setScrollPosition(scrollRef.current?.scrollTop || 0);
    };

    const debounce = (callback: () => void, wait: number) => {
      let timeout: number;

      return () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(callback, wait);
      };
    };

    scrollRef.current?.addEventListener(
      "scroll",
      debounce(handleScrollEnd, 200),
    );

    return () => {
      scrollRef.current?.removeEventListener(
        "scroll",
        debounce(handleScrollEnd, 200),
      );
    };
  }, []);

  const isLoading = isPollLoading || (feedsEnabled && isFeedsLoading);
  const hasData = feedsEnabled && data?.pages?.length && data.pages[0]?.data?.content?.length;

  return (
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
    </StyledFeedStreamContainer>
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
