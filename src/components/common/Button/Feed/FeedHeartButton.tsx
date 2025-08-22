"use client";

import HeartIcon from "@/components/svg/HeartIcon";
import styled from "styled-components";

interface Props {
  likeCount: number;
  isLiked: boolean;
  onClick?: () => void;
}

export function FeedHeartButton({ likeCount, isLiked, onClick }: Props) {
  return (
    <StyledButton
      onClick={() => {
        onClick?.();
      }}
    >
      <HeartIcon $isActive={isLiked} />
      <StyledSpan>{likeCount}</StyledSpan>
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
