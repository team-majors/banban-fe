import type { IconProps } from "@/types/props";
import React from "react";

export const FeedIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ width = 24, height = 24, color, ...props }, ref) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="M8 6H21"
        stroke={color ?? "#181D27"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12H21"
        stroke={color ?? "#181D27"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18H21"
        stroke={color ?? "#181D27"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H3.01"
        stroke={color ?? "#181D27"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12H3.01"
        stroke={color ?? "#181D27"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18H3.01"
        stroke={color ?? "#181D27"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

FeedIcon.displayName = "FeedIcon";
