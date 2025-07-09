import styled from "styled-components";
import FeedsTab from "./FeedsTab/FeedsTab";

export default function RightSection() {
  return (
    <StyledFeedsContainer>
      <FeedsTab />
    </StyledFeedsContainer>
  );
}

const StyledFeedsContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #fff;
  padding: 10px;
  border-radius: 8px 8px 0 0;

  margin-top: 16px;

  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15);
`;
