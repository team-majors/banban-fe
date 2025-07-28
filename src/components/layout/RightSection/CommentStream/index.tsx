import styled from "styled-components";

const CommentStream = () => {
  return (
    <StyledFeedStreamContainer>
      {Array.from({ length: 100 }, (_, index) => (
        <div key={index} className="p-4 border-b border-gray-200">
          댓글 {index + 1}
        </div>
      ))}
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