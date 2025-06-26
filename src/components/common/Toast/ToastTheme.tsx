import React from "react";
import {
  AtSignIcon,
  CheckCircleIcon,
  ErrorIcon,
  InfoIcon,
  WarningIcon,
} from "@/components/svg";

export const ToastTheme = {
  success: {
    icon: <CheckCircleIcon width={12} height={12} color="#039855" />,
    bar: "bg-green-500",
    color: "#D1FADF",
  },
  info: {
    icon: <InfoIcon width={10} height={10} color="#5296D5" />,
    bar: "bg-blue-500",
    color: "#D8ECFF",
  },
  warning: {
    icon: <WarningIcon width={10} height={10} color="#F4BE00" />,
    bar: "bg-yellow-500",
    color: "#FEF0C7",
  },
  error: {
    icon: <ErrorIcon width={10} height={10} color="#D65745" />,
    bar: "bg-red-500",
    color: "#FEE4E2",
  },
  default: {
    icon: <AtSignIcon width={10} height={10} color="#D06BFF" />,
    bar: "bg-purple-500",
    color: "#F4EBFF",
  },
};
