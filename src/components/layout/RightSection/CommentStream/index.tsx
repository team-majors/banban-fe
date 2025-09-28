import styled from "styled-components";
import { useComments } from "@/hooks/useComments";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { Block } from "../Block";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { usePoll } from "@/hooks/usePoll";
import { useTodayISO } from "@/hooks/useTodayIso";

const CommentStream = () => {
  const { targetFeed } = useContext(SectionContext);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments({
    feedId: targetFeed?.id || 0,
    size: 8,
  });
  const today = useTodayISO();
  const { data: pollData } = usePoll(today);

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
        <Fragment key={`comment-page-${index}`}>
          {page?.data?.content?.map((item, idx, array) => {
            const isSecondFromLast = idx === array.length - 2;

            return (
              <Fragment key={`comment-page-${index}-item-${idx}`}>
                {isSecondFromLast && hasNextPage && <div ref={scrollTrigger} />}
                {pollData && (
                  <Block
                    type="comment"
                    commentProps={item}
                    pollData={pollData}
                  />
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
      <div className="flex justify-center items-center h-30">
        {isFetchingNextPage ? (
          <div>로딩중...</div>
        ) : !hasNextPage ? (
          <p className="text-gray-500">불러올 댓글이 없습니다</p>
        ) : null}
      </div>
    </StyledFeedStreamContainer>
  );
};

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

export { CommentStream };
