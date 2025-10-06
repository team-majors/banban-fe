"use client";

import HeartIcon from "@/components/svg/HeartIcon";
import styled from "styled-components";

interface Props {
  likeCount: number;
  isLiked: boolean;
  isLoggedIn?: boolean;
  onClick?: () => void;
  onLoginRequired?: () => void;
}

export function FeedHeartButton({
  likeCount,
  isLiked,
  isLoggedIn = true,
  onClick,
  onLoginRequired
}: Props) {
  const handleClick = () => {
    if (!isLoggedIn) {
      onLoginRequired?.();
      return;
    }
    onClick?.();
  };

  return (
    <StyledButton
      onClick={handleClick}
      disabled={!isLoggedIn}
      $isLoggedIn={isLoggedIn}
    >
      <HeartIcon $isActive={isLiked && isLoggedIn} />
      <StyledSpan>{likeCount}</StyledSpan>
    </StyledButton>
  );
}

const StyledButton = styled.button<{ $isLoggedIn?: boolean }>`
  display: flex;
  gap: 4px;
  align-items: center;
  cursor: ${({ $isLoggedIn }) => ($isLoggedIn ? "pointer" : "not-allowed")};
  opacity: ${({ $isLoggedIn }) => ($isLoggedIn ? 1 : 0.5)};

  &:hover {
    opacity: ${({ $isLoggedIn }) => ($isLoggedIn ? 0.8 : 0.5)};
  }
`;

const StyledSpan = styled.span`
  font-size: 12px;
  color: #767676;
  letter-spacing: -2.5%;
`;
