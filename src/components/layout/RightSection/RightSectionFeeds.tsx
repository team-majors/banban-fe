"use client";

import FeedsTab from "./FeedsTab/FeedsTab";
import FeedStream from "../../feed/list/FeedStream";
import styled from "styled-components";

const StyledDivider = styled.div`
  border-top: 1px solid #f3f3f3;
  margin: 4px 0 0 0;
`;

export default function RightSectionFeeds() {
  return (
    <div>
      <FeedsTab />
      <StyledDivider />
      <FeedStream />
    </div>
  );
}
