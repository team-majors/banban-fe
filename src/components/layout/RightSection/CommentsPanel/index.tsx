import styled from "styled-components";
import { CommentTab } from "../CommentTab";
import { Block } from "../Block";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { CommentStream } from "../CommentStream";
import { usePoll } from "@/hooks/usePoll";
import CommentInputBar from "../CommentInputBar";

const CommentsPanel = () => {
  const { targetFeed } = useContext(SectionContext);
  const { data: pollData } = usePoll();
  return (
    <Container>
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
          <CommentInputBar feedId={targetFeed.id} />
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const StyledDivider = styled.div`
  border-top: 1px solid #f3f3f3;
  margin: 8px 0 0 0;
`;

export { CommentsPanel };
