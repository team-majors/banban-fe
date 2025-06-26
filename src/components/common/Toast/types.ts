export type ToastType = "success" | "info" | "warning" | "error" | "default";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms
}
