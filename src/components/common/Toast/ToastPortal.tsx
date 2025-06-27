"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toast } from "./types";
import ToastItem from "./ToastItem";

interface Props {
  toasts: Toast[];
}

const ToastPortal: React.FC<Props> = ({ toasts }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastPortal;
