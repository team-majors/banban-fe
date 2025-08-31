import styled from "styled-components";
import { CommentTab } from "../CommentTab";
import { Block } from "../Block";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { CommentStream } from "../CommentStream";
import { usePoll } from "@/hooks/usePoll";

const CommentsPanel = () => {
  const { targetFeed } = useContext(SectionContext);
  const { data: pollData } = usePoll();
  return (
    <>
      <CommentTab />
      {targetFeed === null ? (
        <div>오류! 댓글이 없습니다!</div>
      ) : (
        <>
          {pollData && <Block type="commentHead" feedProps={targetFeed} pollData={pollData} />}
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
