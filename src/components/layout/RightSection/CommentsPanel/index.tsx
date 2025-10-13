import styled from "styled-components";
import { CommentTab } from "../CommentTab";
import { Block } from "../Block";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { CommentStream } from "../CommentStream";
import { usePoll } from "@/hooks/usePoll";
import CommentInputBar from "../CommentInputBar";
import { useAuthStore } from "@/store/useAuthStore";

const CommentsPanel = () => {
  const { targetFeed } = useContext(SectionContext);
  const { data: pollData } = usePoll();
  const { isLoggedIn } = useAuthStore();

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
          {isLoggedIn ? (
            <CommentInputBar feedId={targetFeed.id} />
          ) : (
            <StyledLoginNotice role="note">
              댓글을 작성하려면 로그인이 필요합니다.
            </StyledLoginNotice>
          )}
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

const StyledLoginNotice = styled.p`
  padding: 16px;
  font-size: 14px;
  color: #767676;
  text-align: center;
`;

export { CommentsPanel };
