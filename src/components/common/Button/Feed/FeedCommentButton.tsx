"use client";

import { CommentIcon } from "@/components/svg/CommentIcon";
import styled from "styled-components";

export function FeedCommentButton({
  commentCount,
  onClick,
}: {
  commentCount: number;
  onClick: () => void;
}) {
  return (
    <StyledButton
      onClick={() => {
        onClick();
      }}
    >
      <CommentIcon />
      <StyledSpan>{commentCount}</StyledSpan>
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: flex;
  gap: 4px;
  align-items: center;
  cursor: pointer;
`;

const StyledSpan = styled.span`
  font-size: 12px;
  color: #767676;
  letter-spacing: -2.5%;
`;
