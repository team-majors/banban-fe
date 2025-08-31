import styled from "styled-components";
import { useFeedsQuery } from "@/hooks/useFeedsQuery";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect, useRef } from "react";
import { Block } from "../Block";
import useScrollPositionStore from "@/store/useScrollPositionStore";
import { usePoll } from "@/hooks/usePoll";

export default function FeedStream() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedsQuery();
  const { data: pollData } = usePoll();

  const [scrollTrigger, isInView] = useInView({
    threshold: 0,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollPosition, setScrollPosition } = useScrollPositionStore();

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

    scrollRef.current?.addEventListener("scroll", debounce(handleScrollEnd, 200));

    return () => {
      scrollRef.current?.removeEventListener("scroll", debounce(handleScrollEnd, 200));
    };
  }, []);

  return (
    <StyledFeedStreamContainer ref={scrollRef}>
      {data?.pages?.map((page, index) => (
        <Fragment key={`page-${index}`}>
          {page?.data?.content?.map((item, idx, array) => {
            const isSecondFromLast = idx === array.length - 4;

            return (
              <Fragment key={`page-${index}-item-${idx}`}>
                {isSecondFromLast && hasNextPage && <div ref={scrollTrigger} />}
                {pollData && (
                  <>
                    {item.type === "USER" || item.type === "POLL" ? (
                      <Block type="feed" feedProps={item} pollData={pollData} />
                    ) : (
                      <Block type="ad" feedProps={item} pollData={pollData} />
                    )}
                  </>
                )}
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
