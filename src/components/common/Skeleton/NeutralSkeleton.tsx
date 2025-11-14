"use client";

import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface NeutralSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  rounded?: boolean;
}

export default function NeutralSkeleton({
  width = "100%",
  height = "1rem",
  radius,
  rounded = false,
  style,
  className,
  ...rest
}: NeutralSkeletonProps) {
  return (
    <div
      className={clsx(
        "inline-block bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer",
        rounded && "rounded-full",
        className,
      )}
      style={{
        width,
        height,
        borderRadius: rounded ? undefined : radius,
        ...style,
      }}
      {...rest}
    />
  );
}
