"use client";

import React, { createContext, useCallback, useState } from "react";
import { Toast } from "./types";
import ToastPortal from "./ToastPortal";
import { v4 as uuidv4 } from "uuid";

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    ({ type, message, duration = 3000, action }: Omit<Toast, "id">) => {
      const id = uuidv4();
      const newToast: Toast = { id, type, message, duration, action };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastPortal toasts={toasts} />
    </ToastContext.Provider>
  );
};
