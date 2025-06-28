import React from "react";
import styled, { css } from "styled-components";

interface DefaultButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: React.ReactNode;
}

const cursorStyle = css<DefaultButtonProps>`
  cursor: ${({ isActive }) => (isActive ? "pointer" : "default")};
`;

const hoverStyle = css<DefaultButtonProps>`
  ${({ isActive }) =>
    isActive &&
    css`
      &:hover {
        background-color: #d5d7da;
      }
    `}
`;

const baseStyle = css`
  transition: background-color 0.4s ease;
`;

const BackgroundStyle = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive",
})<DefaultButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
  border: 1px solid #d5d7da;
  border-radius: 8px;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

  padding: 8px 14px;

  user-select: none;

  ${baseStyle}
  ${cursorStyle}
  ${hoverStyle}

  &:disabled {
    border-color: #e9eaeb;
    color: #d5d7da;
  }
`;

const ContentStyle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`;

export const DefaultButton = ({
  isActive = true,
  onClick,
  children,
  ...rest
}: DefaultButtonProps) => {
  return (
    <BackgroundStyle
      isActive={isActive}
      disabled={!isActive}
      onClick={onClick}
      {...rest}
    >
      <ContentStyle>{children}</ContentStyle>
    </BackgroundStyle>
  );
};
