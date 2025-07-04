"use client";

import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useId,
} from "react";
import styled, { css, CSSProperties } from "styled-components";

const InputContext = createContext<InputContextType | null>(null);

export const Input = ({ $width, children, ...rest }: InputProps) => {
  const baseId = useId();
  const inputId = `${baseId}-field`;
  const errorId = `${baseId}-error`;

  return (
    <InputContext.Provider value={{ inputId, errorId }}>
      <InputWrapper $width={$width} {...rest}>
        {children}
      </InputWrapper>
    </InputContext.Provider>
  );
};

const Label = ({ children, ...rest }: LabelProps) => {
  const context = useContext(InputContext);

  return (
    <InputLabelWrapper>
      <StyledLabel {...rest} htmlFor={context?.inputId}>
        {children}
      </StyledLabel>
    </InputLabelWrapper>
  );
};
Label.displayName = "Input.Label";
Input.Label = Label;

const InputField = ({ $isValidate, $icon, ...rest }: InputFieldProps) => {
  const context = useContext(InputContext);

  const describeBy = !$isValidate ? context?.errorId : undefined;

  return (
    <InputFieldWrapper>
      {!!$icon && <IconWrapper>{$icon}</IconWrapper>}
      <StyledInputField
        $isValidate={$isValidate}
        $icon={$icon}
        id={context?.inputId}
        aria-invalid={!$isValidate}
        aria-describedby={describeBy}
        {...rest}
      />
    </InputFieldWrapper>
  );
};
InputField.displayName = "Input.Field";
Input.Field = InputField;

const ErrorMessage = ({ children, ...rest }: ErrorMessageProps) => {
  const context = useContext(InputContext);

  return (
    <ErrorMessageWrapper>
      <StyledErrorMessage {...rest} id={context?.errorId}>
        {children}
      </StyledErrorMessage>
    </ErrorMessageWrapper>
  );
};
ErrorMessage.displayName = "Input.ErrorMessage";
Input.ErrorMessage = ErrorMessage;

// interface
interface InputContextType {
  inputId: string;
  errorId: string;
}

interface StyledInputFieldProps {
  $isValidate: boolean;
  $icon?: ReactNode;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  $isValidate: boolean;
  $icon?: ReactNode;
}

interface InputProps extends HTMLAttributes<HTMLDivElement> {
  $width?: CSSProperties["width"];
  children: ReactNode;
}

interface InputWrapperProps {
  $width?: CSSProperties["width"];
}

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

interface ErrorMessageProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

// Wrapper 및 Styled 속성
const InputWrapper = styled.div<InputWrapperProps>`
  width: ${({ $width }) => {
    if ($width == undefined) return "100%";
    return typeof $width === "number" ? `${$width}px` : $width;
  }};
  display: flex;
  flex-direction: column;
`;

const InputLabelWrapper = styled.div`
  padding-bottom: 6px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  font-size: 14px;
`;

const InputFieldWrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
`;

const StyledInputField = styled.input<StyledInputFieldProps>`
  width: 100%;
  border: 1px solid #d5d7da;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 1px 2px rgba(10, 13, 18, 0.05);
  box-sizing: border-box;

  ${({ $isValidate }) => {
    if (!$isValidate) {
      return css`
        border-color: #ff474f;
        color: #ff474f;

        &:focus {
          color: black;
        }
      `;
    }
  }}

  ${({ $icon }) =>
    !!$icon &&
    css`
      padding-left: 35px;
    `}
`;

const ErrorMessageWrapper = styled.div`
  padding-top: 2px;
  padding-left: 5px;
`;

const StyledErrorMessage = styled.span`
  color: #ff474f;
  font-size: 12px;
`;
