import styled from "styled-components";
import { AdFeedBlock, UserFeedBlock } from "../FeedBlock";
import { useFeedsQuery } from "@/hooks/useFeedsQuery";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";

export default function FeedStream() {
  const { data, fetchNextPage, hasNextPage } = useFeedsQuery();

  const [scrollTrigger, isInView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (hasNextPage && isInView) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage]);

  return (
    <StyledFeedStreamContainer>
      {data?.pages?.map((page, index) => (
        <Fragment key={`page-${index}`}>
          {page?.data?.content?.map((item, idx, array) => {
            const isSecondFromLast = idx === array.length - 4;

            return (
              <Fragment key={`page-${index}-item-${idx}`}>
                {isSecondFromLast && hasNextPage && <div ref={scrollTrigger} />}
                {item.type === "NORMAL" || item.type === "POLL" ? (
                  <UserFeedBlock feedProps={item} />
                ) : (
                  <AdFeedBlock feedProps={item} />
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
      <div className="flex justify-center items-center h-30">
        {hasNextPage ? (
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
`;
