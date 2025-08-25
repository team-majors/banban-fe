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
}

export const SelectOptionGroup = ({
  selected,
  firstOptionString,
  secondOptionString,
  onClick,
  ...styleProps
}: SelectOptionGroupProps) => {
  return (
    <StyledSelectOptionGroup {...styleProps}>
      <StyledButton
        disabled={selected !== "none"}
        isIdle={selected === "none"}
        isSelected={selected === "firstOption"}
        onClick={() => {
          if (selected === "none") {
            onClick("firstOption");
          }
        }}
        fromColor="#FF05CE"
        toColor="#FF474F"
      >
        {firstOptionString}
      </StyledButton>
      <StyledButton
        disabled={selected !== "none"}
        isIdle={selected === "none"}
        isSelected={selected === "secondOption"}
        onClick={() => {
          if (selected === "none") {
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

  ${({ isSelected, isIdle }) => {
    if (isIdle === true) {
      return css``;
    }

    if (isIdle === false && isSelected === false) {
      return css`
        &::before {
        }

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
