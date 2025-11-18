import styled from "styled-components";
import { useFeeds } from "@/hooks/api/feed/useFeeds";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect, useRef } from "react";
import { Block } from "../../layout/RightSection/Block";
import useScrollPositionStore from "@/store/useScrollPositionStore";
import { usePoll } from "@/hooks/api/poll/usePoll";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";

export default function FeedStream() {
  const { sortBy, filterType } = useFeedFilterStore();
  const { data: todayPoll, isLoading: isPollLoading } = usePoll();
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
    rootMargin: "200px", // 200px 전에 미리 로드 (부드러운 UX)
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { getPosition, setPosition } = useScrollPositionStore();
  const scrollKey = `feeds:${sortBy}:${filterType}`;

  // 무한 스크롤 디바운스 (빠른 스크롤 시 불필요한 fetch 방지)
  useEffect(() => {
    if (!feedsEnabled || !hasNextPage || !isInView) return;

    const timeoutId = setTimeout(() => {
      fetchNextPage();
    }, 100); // 100ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [isInView, hasNextPage, feedsEnabled, fetchNextPage]);

  // 스크롤 위치 복원
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const stored = getPosition(scrollKey);
    if (stored <= 0) return;
    container.scrollTo(0, stored);
  }, [getPosition, scrollKey, data?.pages?.length]);

  // 현재 스크롤 위치 저장
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
      // 언마운트 시점의 위치도 저장해 둔다
      setPosition(scrollKey, container.scrollTop || 0);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollKey, setPosition]);

  const isLoading = isPollLoading || (feedsEnabled && isFeedsLoading);
  const hasData =
    feedsEnabled && data?.pages?.length && data.pages[0]?.data?.content?.length;

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
                      <Block type="ad" feedProps={item} pollData={todayPoll} />
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
