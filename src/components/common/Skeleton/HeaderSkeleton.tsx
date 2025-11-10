"use client";

import { media } from "@/constants/breakpoints";
import styled, { keyframes } from "styled-components";

export default function HeaderSkeleton() {
  return (
    <Container data-testid="header-skeleton">
      <LogoArea>
        <SkeletonRect width={128} height={46} />
      </LogoArea>
      <Actions>
        <SkeletonRoundedRect width={60} height={46} />
        <SkeletonRoundedRect width={60} height={46} />
      </Actions>
    </Container>
  );
}

const loading = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${loading} 1.2s ease-in-out infinite;
  border-radius: 4px;
`;

const SkeletonRect = styled(SkeletonBase)<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;

  ${media.mobile} {
    width: ${({ width }) => Math.max(56, Math.round(width * 0.8))}px;
    height: ${({ height }) => Math.max(32, Math.round(height * 0.85))}px;
  }
`;

const SkeletonRoundedRect = styled(SkeletonRect)`
  border-radius: 12px;
`;

const Container = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 32px;
  background-color: #f4f6f8;

  ${media.mobile} {
    padding: 0 12px;
    justify-content: space-between;
  }
`;

const LogoArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  ${media.mobile} {
    position: static;
    transform: none;
  }
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;

  ${media.mobile} {
    margin-left: 0;
    gap: 8px;
  }
`;
