"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";
import FeedCommentsSection from "../../feed/detail/CommentThread";

export default function MobileBackground() {
  const router = useRouter();

  return (
    <Container>
      <FeedCommentsSection />
      <HomeButton onClick={() => router.push("/")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>홈으로</span>
      </HomeButton>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  inset: 0;
  padding-top: 64px;
  height: 100dvh;
  overflow: hidden;
  z-index: 1;
`;

const HomeButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #3f13ff;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(63, 19, 255, 0.3);
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3310dd;
    box-shadow: 0 6px 16px rgba(63, 19, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
