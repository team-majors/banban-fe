'use client';

import { useState } from "react";
import { CommentIcon } from "@/components/svg/CommentIcon";
import styled from "styled-components";

export function FeedCommentButton({ commentCount }: { commentCount: number }) {
  const [commented, setCommented] = useState<boolean>(false);
  const [count] = useState<number>(commentCount);

  return (
    <StyledButton onClick={() => {
      setCommented(!commented);
    }}>
      <CommentIcon />
      <StyledSpan>{count}</StyledSpan>
    </StyledButton>
  )
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
