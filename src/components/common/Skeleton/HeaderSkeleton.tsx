"use client";

import styled, { keyframes } from "styled-components";

export default function HeaderSkeleton() {
  return (

    <Container data-testid="header-skeleton">
      <LogoArea>
        <SkeletonRect width={100} height={32} />
      </LogoArea>
      <Actions>
        <SkeletonCircle size={48} />
        <SkeletonCircle size={48} />
        <SkeletonRect width={86} height={44} />
        <SkeletonRect width={86} height={44} />
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
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const SkeletonCircle = styled(SkeletonBase)<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
`;

const Container = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 32px;
  background-color: #f9f8ff;
`;

const LogoArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;
