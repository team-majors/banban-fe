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
  const { targetFeed, inBottomSheet } = useContext(SectionContext);
  const { data: pollData } = usePoll();
  const { isLoggedIn } = useAuthStore();

  if (targetFeed === null) {
    return (
      <Container $inBottomSheet={inBottomSheet}>
        오류! 댓글이 없습니다!
      </Container>
    );
  }

  return (
    <Container $inBottomSheet={inBottomSheet}>
      {/* 고정 헤더: 피드 내용 */}
      <Header>
        <CommentTab />
        {pollData && (
          <>
            <Block
              type="commentHead"
              feedProps={targetFeed}
              pollData={pollData}
            />
            <StyledDivider />
          </>
        )}
      </Header>

      {/* 스크롤 가능한 댓글 영역 */}
      <ScrollableContent>
        <CommentStream />
      </ScrollableContent>

      {/* 고정 푸터: 댓글 입력 폼 */}
      <Footer>
        {isLoggedIn ? (
          <CommentInputBar feedId={targetFeed.id} />
        ) : (
          <StyledLoginNotice role="note">
            댓글을 작성하려면 로그인이 필요합니다.
          </StyledLoginNotice>
        )}
      </Footer>
    </Container>
  );
};

const Container = styled.div<{ $inBottomSheet?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.$inBottomSheet ? "1" : "initial")};
  height: ${(props) => (props.$inBottomSheet ? "unset" : "100%")};
  min-height: ${(props) => (props.$inBottomSheet ? "0" : "auto")};
  position: relative;
`;

const Header = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid #f3f3f3;
  background-color: white;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 0; /* 필수: flex 자식이 overflow를 정상 작동하게 함 */

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
  }
`;

const Footer = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #f3f3f3;
  background-color: white;
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

export default CommentsPanel;
