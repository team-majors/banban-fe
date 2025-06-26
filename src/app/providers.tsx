"use client";

interface Props {
  children?: React.ReactNode;
}

import { ToastProvider } from "@/components/common/Toast/ToastContext";

export const NextProvider = ({ children }: Props) => {
  return <ToastProvider>{children}</ToastProvider>;
};
