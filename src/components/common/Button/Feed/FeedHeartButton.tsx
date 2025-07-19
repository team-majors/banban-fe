"use client";

import { useState } from "react";
import HeartIcon from "@/components/svg/HeartIcon";
import styled from "styled-components";
import useAuth from "@/hooks/useAuth";
import useLoginModal from "@/hooks/useLoginModal";

export function FeedHeartButton() {
  const { openLoginModal } = useLoginModal();
  const { isLoggedIn } = useAuth();

  const [liked, setLiked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const handleClick = () => {
    if (isLoggedIn) {
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    } else {
      openLoginModal();
    }
  };

  return (
    <StyledButton onClick={handleClick}>
      <HeartIcon $isActive={liked} />
      <StyledSpan>{count}</StyledSpan>
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
