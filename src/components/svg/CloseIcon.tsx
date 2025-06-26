import React from "react";
import { forwardRef } from "react";
import type { IconProps } from "@/types/IconProps";

export const CloseIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ width = 32, height = 32, color, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: color }}
        aria-label="close modal"
        {...props}
      >
        <path
          d="M2.58579 2.58579C3.36684 1.80474 4.63316 1.80474 5.41421 2.58579L29.4142 26.5858C30.1953 27.3668 30.1953 28.6332 29.4142 29.4142C28.6332 30.1953 27.3668 30.1953 26.5858 29.4142L2.58579 5.41421C1.80474 4.63316 1.80474 3.36683 2.58579 2.58579Z"
          fill="currentColor"
        />
        <path
          d="M29.4142 2.58579C28.6332 1.80474 27.3668 1.80474 26.5858 2.58579L2.58579 26.5858C1.80474 27.3668 1.80474 28.6332 2.58579 29.4142C3.36684 30.1953 4.63317 30.1953 5.41422 29.4142L29.4142 5.41421C30.1953 4.63316 30.1953 3.36683 29.4142 2.58579Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

export const CloseThickIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ width = 32, height = 32, color, ...props }, ref) => {
    return (
      <svg
        fill="currentColor"
        ref={ref}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        style={{ color: color }}
        aria-label="close modal"
        {...props}
      >
        <path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z" />
      </svg>
    );
  }
);
CloseIcon.displayName = "CloseIcon";
CloseThickIcon.displayName = "CloseThickIcon";
