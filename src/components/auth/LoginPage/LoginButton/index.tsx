"use client";
import React from "react";
import styled from "styled-components";

export interface LoginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  color: string;
  fontcolor: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const LoginButton = ({
  color,
  fontcolor,
  disabled = false,
  icon,
  children,
  onClick,
  ...props
}: LoginButtonProps) => {
  return (
    <StyledButton
      role="button"
      color={color}
      $fontcolor={fontcolor}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
      onClick={onClick}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <LabelWrapper> {children}</LabelWrapper>
    </StyledButton>
  );
};

interface StyledButtonProps {
  $fontcolor: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
}

const StyledButton = styled.button<StyledButtonProps>`
  height: 44px;
  display: flex;
  padding: 10px;
  width: 100%;
  min-width: 240px;
  color: ${(props) => props.$fontcolor};
  background-color: ${({ color }) => color};
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  border-radius: 8px;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    pointer-events: none; 
  `}

  &:focus {
    box-shadow: ${({ disabled }) =>
      disabled ? "none" : "0 0 0 3px rgba(0, 0, 0, 0.1)"};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
