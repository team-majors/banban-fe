"use client";
import styled, { css } from "styled-components";
import { CSSProperties } from "styled-components";
import { DefaultButton } from "@/components/common/Button";

type StyledSelectOptionGroupProps = Pick<
  CSSProperties,
  "width" | "height" | "rowGap"
>;

export type selectOption = "firstOption" | "secondOption" | "none";

interface SelectOptionGroupProps extends StyledSelectOptionGroupProps {
  selected: "firstOption" | "secondOption" | "none";
  firstOptionString: string;
  secondOptionString: string;
  onClick: (internalState: selectOption) => void;
  isAuthenticated: boolean;
}

export const SelectOptionGroup = ({
  selected,
  firstOptionString,
  secondOptionString,
  onClick,
  isAuthenticated,
  ...styleProps
}: SelectOptionGroupProps) => {
  const isDisabled =
    !isAuthenticated || (selected !== "firstOption" && selected !== "none");
  const isDisabled2 =
    !isAuthenticated || (selected !== "secondOption" && selected !== "none");
  console.log(selected, isAuthenticated, "asdfasdfasdfasdfasdfasdfas");
  return (
    <StyledSelectOptionGroup {...styleProps}>
      <StyledButton
        disabled={isDisabled}
        isIdle={selected === "none"}
        isSelected={selected === "firstOption"}
        onClick={() => {
          if (selected === "none" && isAuthenticated) {
            onClick("firstOption");
          }
        }}
        fromColor="#FF05CE"
        toColor="#FF474F"
      >
        {firstOptionString}
      </StyledButton>
      <StyledButton
        disabled={isDisabled2}
        isIdle={selected === "none"}
        isSelected={selected === "secondOption"}
        onClick={() => {
          if (selected === "none" && isAuthenticated) {
            onClick("secondOption");
          }
        }}
        fromColor="#6142FF"
        toColor="#1478FF"
      >
        {secondOptionString}
      </StyledButton>
    </StyledSelectOptionGroup>
  );
};

interface StyledGradientProps {
  fromColor: string;
  toColor: string;
  isIdle: boolean;
  isSelected: boolean;
  disabled: boolean;
}

const StyledButton = styled(DefaultButton).withConfig({
  shouldForwardProp: (prop) =>
    !["fromColor", "toColor", "isIdle", "isSelected"].includes(prop),
})<StyledGradientProps>`
  display: flex;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      ${({ fromColor }) => fromColor} 0%,
      ${({ toColor }) => toColor} 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }

  & > div {
    background: linear-gradient(
      to right,
      ${({ fromColor }) => fromColor} 0%,
      ${({ toColor }) => toColor} 100%
    );
    background-clip: text;
    color: transparent;
    transition: all 0.4s ease;
  }

  &:hover > div {
    background: white;
    background-clip: text;
    color: transparent;
  }

  /* disabled 상태에서는 hover 효과 제거 */
  &:disabled:hover::before {
    opacity: 1;
  }

  &:disabled:hover > div {
    background: none;
    background-clip: text;
    color: #b9b9b9;
  }

  /* 🔹 disabled 상태 */
  &:disabled {
    background-color: white !important;

    &::before {
      background: white;
      opacity: 1;
    }

    & > div {
      color: #b9b9b9;
      background: none;
    }
  }

  ${({ isSelected, isIdle }) => {
    if (isIdle === true) {
      return css``;
    }

    if (isIdle === false && isSelected === false) {
      return css`
        & > div {
          background: #808080;
          background-clip: text;
          color: transparent;
        }
      `;
    }

    if (isSelected === true) {
      return css`
        & > div {
          background: white;
          background-clip: text;
          color: transparent;
        }
        &::before {
          opacity: 1;
        }
      `;
    } else {
      return css`
        & > div {
          z-index: 2;
          color: #b9b9b9;
          transition: all 0.4s ease;
        }
      `;
    }
  }}
`;

const StyledSelectOptionGroup = styled.div.withConfig({
  shouldForwardProp: (prop) => !["rowGap"].includes(prop),
})<StyledSelectOptionGroupProps>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  display: flex;
  flex-direction: column;
  row-gap: ${({ rowGap }) => rowGap};
`;
