import styled from "styled-components";
import FeedsTab from "./FeedsTab/FeedsTab";
import FeedStream from "./FeedStream";

export default function RightSection() {
  return (
    <StyledFeedsContainer>
      <FeedsTab />
      <StyledDivider />
      <FeedStream />
    </StyledFeedsContainer>
  );
}

const StyledFeedsContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #fff;
  padding: 10px 10px 0 10px;
  border-radius: 8px 8px 0 0;

  margin-top: 16px;

  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15);
`;

const StyledDivider = styled.div`
  border-top: 1px solid #F3F3F3;
  margin: 4px 0 0 0;
`;