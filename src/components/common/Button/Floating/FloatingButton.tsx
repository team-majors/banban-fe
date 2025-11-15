import styled from "styled-components";
import { AddIcon, CloseIcon } from "@/components/svg";
import { media } from "@/constants/breakpoints";

interface StateProp {
  $isActive: boolean;
}

interface FloatingButtonProps {
  state: "add" | "close";
  onToggle?: () => void;
}

export const FloatingButton = ({ state, onToggle }: FloatingButtonProps) => {
  return (
    <BackgroundStyle
      onClick={onToggle}
      aria-label={state === "add" ? "추가하기" : "닫기"}
    >
      <IconLayer $isActive={state === "add"}>
        <AddIcon color="#fff" width={32} height={32} />
      </IconLayer>
      <IconLayer $isActive={state === "close"}>
        <CloseIcon color="#fff" width={32} height={32} />
      </IconLayer>
    </BackgroundStyle>
  );
};

const BackgroundStyle = styled.button`
  width: 72px;
  height: 72px;
  border: 1px solid #fff;
  border-radius: 50%;
  background: linear-gradient(to right, #6142ff 0%, #3f13ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  ${media.mobile} {
    width: 60px;
    height: 60px;
  }
`;

const IconLayer = styled.div<StateProp>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transform: ${({ $isActive }) =>
    $isActive ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)"};
  pointer-events: ${({ $isActive }) => ($isActive ? "auto" : "none")};

  svg {
    width: 32px;
    height: 32px;

    ${media.mobile} {
      width: 28px;
      height: 28px;
    }
  }
`;
