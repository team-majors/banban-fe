'use client';

import { useState } from "react"; 
import HeartIcon from "@/components/svg/HeartIcon";
import styled from "styled-components";

export function FeedHeartButton() {
  const [liked, setLiked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  return (
    <StyledButton onClick={() => {
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    }}>
      <HeartIcon $isActive={liked} />
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