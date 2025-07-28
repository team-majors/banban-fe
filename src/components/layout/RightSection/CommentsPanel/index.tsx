import styled from "styled-components";
import { CommentTab } from "../CommentTab";
import { CommentHeadBlock } from "../Block/CommentHeadBlock";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { CommentStream } from "../CommentStream";

const CommentsPanel = () => {
  const { targetFeed } = useContext(SectionContext);

  return (
    <>
      <CommentTab />
      {targetFeed === null ? (
        <div>오류! 댓글이 없습니다!</div>
      ) : (
        <>
          <CommentHeadBlock feedProps={targetFeed} />
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
