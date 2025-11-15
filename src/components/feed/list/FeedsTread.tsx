import FeedsTab from "../../layout/RightSection/FeedsTab/FeedsTab";
import FeedStream from "./FeedStream";
import styled from "styled-components";

export default function FeedsTread() {
  return (
    <>
      <FeedsTab />
      <StyledDivider />
      <FeedStream />
    </>
  );
}

const StyledDivider = styled.div`
  border-top: 1px solid #f3f3f3;
  margin: 4px 0 0 0;
`;
