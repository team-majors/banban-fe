import styled from "styled-components";
import { useFeeds } from "@/hooks/useFeeds";
import { useInView } from "react-intersection-observer";
import { Fragment, useContext, useEffect, useMemo, useRef } from "react";
import { Block } from "../Block";
import useScrollPositionStore from "@/store/useScrollPositionStore";
import { useTodayISO } from "@/hooks/useTodayIso";
import { useQueries } from "@tanstack/react-query";
import { fetchPoll } from "@/remote/poll";
import type { Poll } from "@/types/poll";
import { useSearchParams } from "next/navigation";
import { SectionContext } from "../SectionContext";

export default function FeedStream() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeeds();
  const today = useTodayISO();

  const [scrollTrigger, isInView] = useInView({
    threshold: 0,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollPosition, setScrollPosition } = useScrollPositionStore();
  const searchParams = useSearchParams();
  const { setSectionStatus, setTargetFeed } = useContext(SectionContext);

  const dates = useMemo(() => {
    const set = new Set<string>();
    data?.pages?.forEach((page) => {
      page?.data?.content?.forEach((item: any) => {
        const d = item?.createdAt?.slice(0, 10);
        if (d) set.add(d);
      });
    });
    if (today) set.add(today);
    return Array.from(set);
  }, [data?.pages, today]);

  const polls = useQueries({
    queries: dates.map((d) => ({
      queryKey: ["polls", d],
      queryFn: () => fetchPoll(d),
      staleTime: 60_000,
      enabled: !!d,
    })),
  });

  const pollMap = useMemo(() => {
    const map = new Map<string, Poll>();
    dates.forEach((d, i) => {
      const q = polls[i];
      if (q && q.data) map.set(d, q.data);
    });
    return map;
  }, [polls, dates]);

  useEffect(() => {
    if (hasNextPage && isInView) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage]);

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

  // Deep-linking: /?feedId=123&tab=comments
  useEffect(() => {
    const feedIdParam = searchParams.get("feedId");
    const tab = searchParams.get("tab");
    if (!feedIdParam) return;
    const feedId = Number(feedIdParam);
    if (!Number.isFinite(feedId)) return;

    let found: any = null;
    data?.pages?.some((page) => {
      const hit = page?.data?.content?.find((it: any) => it?.id === feedId);
      if (hit) {
        found = hit;
        return true;
      }
      return false;
    });

    if (found) {
      setTargetFeed(found);
      if (tab === "comments") setSectionStatus("comments");
    }
  }, [data?.pages, searchParams, setSectionStatus, setTargetFeed]);

  return (
    <StyledFeedStreamContainer ref={scrollRef}>
      {data?.pages?.map((page, index) => (
        <Fragment key={`page-${index}`}>
          {page?.data?.content?.map((item, idx, array) => {
            const isSecondFromLast = idx === array.length - 4;

            return (
              <Fragment key={`page-${index}-item-${idx}`}>
                {isSecondFromLast && hasNextPage && <div ref={scrollTrigger} />}
                {(() => {
                  const dateKey = item?.createdAt?.slice(0, 10) || today;
                  const p = (dateKey && pollMap.get(dateKey)) || undefined;
                  return (
                    <>
                      {item.type === "USER" || item.type === "POLL" ? (
                        <Block type="feed" feedProps={item} pollData={p as Poll} />
                      ) : (
                        <Block type="ad" feedProps={item} pollData={p as Poll} />
                      )}
                    </>
                  );
                })()}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
      <div className="flex justify-center items-center h-30">
        {isFetchingNextPage ? (
          <div>로딩중...</div>
        ) : (
          <p className="text-gray-500">불러올 피드가 없습니다</p>
        )}
      </div>
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
