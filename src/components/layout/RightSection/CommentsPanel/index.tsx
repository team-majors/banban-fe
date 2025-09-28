import styled from "styled-components";
import { CommentTab } from "../CommentTab";
import { Block } from "../Block";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { CommentStream } from "../CommentStream";
import { usePoll } from "@/hooks/usePoll";
import { useTodayISO } from "@/hooks/useTodayIso";

const CommentsPanel = () => {
  const { targetFeed } = useContext(SectionContext);
  const today = useTodayISO();
  const { data: pollData } = usePoll(today);
  return (
    <>
      <CommentTab />
      {targetFeed === null ? (
        <div>오류! 댓글이 없습니다!</div>
      ) : (
        <>
          {pollData && (
            <Block
              type="commentHead"
              feedProps={targetFeed}
              pollData={pollData}
            />
          )}
          <StyledDivider />
          <CommentStream />
        </>
      )}
    </>
  );
};

const StyledDivider = styled.div`
  border-top: 1px solid #f3f3f3;
  margin: 8px 0 0 0;
`;

export { CommentsPanel };
