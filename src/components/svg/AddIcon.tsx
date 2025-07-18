import React from "react";
import { forwardRef } from "react";
import type { IconProps } from "@/types/IconProps";

export const AddIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ width = 32, height = 32, color, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: color }}
        aria-label="open modal"
        {...props}
      >
        <path
          d="M18 2.66666C18 1.56209 17.1045 0.666656 16 0.666656C14.8954 0.666656 14 1.56209 14 2.66666V14H2.66663C1.56206 14 0.666626 14.8954 0.666626 16C0.666626 17.1046 1.56206 18 2.66663 18H14V29.3333C14 30.4379 14.8954 31.3333 16 31.3333C17.1045 31.3333 18 30.4379 18 29.3333V18H29.3333C30.4379 18 31.3333 17.1046 31.3333 16C31.3333 14.8954 30.4379 14 29.3333 14H18V2.66666Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

AddIcon.displayName = "AddIcon";
