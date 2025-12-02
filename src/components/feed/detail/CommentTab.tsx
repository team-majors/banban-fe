import styled from "styled-components";

const CommentTab = () => {
  return (
    <StyledContainer>
      <StyledCommentsTab />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px;

  gap: 10px;

  align-items: start;
`;

const StyledCommentsTab = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export { CommentTab };
