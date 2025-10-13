"use client";

import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Toast } from "../types";
import { ToastTheme } from "../ToastTheme";
import { CloseIcon } from "@/components/svg";

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { type, message, duration = 3000, action } = toast;
  const ref = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => setIsVisible(false);
  const handleAction = () => {
    if (!action) return;
    action.onClick();
    setIsVisible(false);
  };

  const theme = ToastTheme[type];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <ToastWrapper>
      <FlexContainer>
        <IconWrapper bgcolor={theme.color}>{theme.icon}</IconWrapper>
        <Message>{message}</Message>
        {action && (
          <ActionButton type="button" onClick={handleAction}>
            {action.label}
          </ActionButton>
        )}
      </FlexContainer>
      <CloseIcon
        style={iconStyle}
        ref={ref}
        onClick={handleClose}
        role="button"
        aria-label="Close Toast"
      />
      <ProgressBar className={theme.bar} duration={duration} />
    </ToastWrapper>
  );
};

const shrink = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const iconStyle = {
  right: 12,
  top: 12,
  position: "absolute",
  width: "12px",
  height: "12px",
} as const;

const ToastWrapper = styled.div`
  width: 320px;
  max-height: 100px;
  padding-right: 12px;
  padding-bottom: 6px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  background-color: white;
`;

const IconWrapper = styled.div<{ bgcolor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background-color: ${(props) => props.bgcolor};
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  height: 6px;
  animation: ${shrink} ${(props) => props.duration}ms linear forwards;
`;

const FlexContainer = styled.div`
  display: flex;
  max-height: 100px;
  align-items: center;
  padding: 18px 16px;
  gap: 12px;
`;

const Message = styled.p`
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  color: #000000;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background-color: #f1f5f9;
  color: #1f2937;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #e2e8f0;
  }
`;

export default ToastItem;
