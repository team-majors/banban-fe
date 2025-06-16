import React from "react";
import styled from "styled-components";
import { AddIcon, CloseIcon } from "@/components/svg";

const BackgroundStyle = styled.button`
  width: 72px;
  height: 72px;
  border: 1px solid #fff;
  border-radius: 50%;
  background: linear-gradient(to right, #6142FF 0%, #3F13FF 100%);

  display: flex;
  justify-content: center;
  align-items: center;
`;

interface StateProp {
  isActive: boolean;
}

/* 두 아이콘을 겹쳐 놓고, show prop으로 투명도·변형을 조절 */
const IconLayer = styled.div<StateProp>`
  position: absolute;
  display: flex;
  transition: opacity .25s ease, transform .25s ease;

  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transform: ${({ isActive }) =>
    isActive ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)'};
`;

interface FloatingButtonProps {
  state: 'add' | 'close';
  onToggle?: () => void;
}

export const FloatingButton = ({ state, onToggle }: FloatingButtonProps) => {
  return (
    <BackgroundStyle 
      onClick={onToggle}
      aria-label={state === 'add' ? '추가하기' : '닫기'}
    >
      <IconLayer isActive={state === 'add'}>
        <AddIcon color="#fff" width={32} height={32} />
      </IconLayer>

      <IconLayer isActive={state === 'close'}>
        <CloseIcon color="#fff" width={32} height={32} />
      </IconLayer>
    </BackgroundStyle>
  );
};