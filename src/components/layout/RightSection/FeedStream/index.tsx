import styled from "styled-components";
import { AdFeedBlock, UserFeedBlock } from "../FeedBlock";

export default function FeedStream() {
  return (
    <StyledFeedStreamContainer>
      {[...Array(100)].map((_, i) => {
        if ((i + 1) % 10 === 4) {
          return <AdFeedBlock key={i + 1} />;
        } else {
          return <UserFeedBlock key={i + 1} />;
        }
      })}
    </StyledFeedStreamContainer>
  );
}

const StyledFeedStreamContainer = styled.div`
  height: 100%;

  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
