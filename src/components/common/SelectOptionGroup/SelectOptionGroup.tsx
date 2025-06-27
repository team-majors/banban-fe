'use client'

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { CSSProperties } from 'styled-components';
import { DefaultButton } from '@/components/common/Button';

type SelectOptionGroupStyleProps = Pick<CSSProperties, 'width' | 'height' | 'rowGap'>

type selectOption = 'firstOption' | 'secondOption' | 'none';

interface SelectOptionGroupProps extends SelectOptionGroupStyleProps {
  firstOptionString: string
  secondOptionString: string
  onChange: (internalState: selectOption) => selectOption;
}

interface GradientStyleProps {
  fromColor: string;
  toColor: string;
  isIdle: boolean;
  isSelected: boolean;
}

const ButtonStyle = styled(DefaultButton).withConfig({
  shouldForwardProp: (prop) => !['fromColor', 'toColor', 'isIdle', 'isSelected'].includes(prop)
})<GradientStyleProps>`
  display: flex;
  justify-content: center;

  position: relative;
  overflow: hidden;

  &::before {
    content: '';
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
      return css``
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
      `
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
      `
    } else {
      return css`
        & > div {
          z-index: 2;
          color: #b9b9b9;
          transition: all 0.4s ease;
        }
      `
    }
  }}
`

const SelectOptionGroupStyle = styled.div.withConfig({
  shouldForwardProp: (prop) => !['rowGap'].includes(prop)
})<SelectOptionGroupStyleProps>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  display: flex;
  flex-direction: column;
  row-gap: ${({ rowGap }) => rowGap};
`

export const SelectOptionGroup = ({ firstOptionString, secondOptionString, onChange, ...styleProps }: SelectOptionGroupProps) => {
  const [selectState, setSelectState] = useState<selectOption>('none');

  useEffect(() => {
    onChange(selectState);
  }, [selectState, onChange])

  return (
    <SelectOptionGroupStyle {...styleProps}>
      <ButtonStyle 
        fromColor="#FF05CE" 
        toColor="#FF474F" 
        isIdle={selectState === 'none'}
        isSelected={selectState === 'firstOption'} 
        onClick={() => setSelectState('firstOption')}
      >
        {firstOptionString}
      </ButtonStyle>
      <ButtonStyle 
        fromColor="#6142FF"
        toColor="#1478FF"
        isIdle={selectState === 'none'}
        isSelected={selectState === 'secondOption'}
        onClick={() => setSelectState('secondOption')}
      >
        {secondOptionString}
      </ButtonStyle>
    </SelectOptionGroupStyle>
  )
}
