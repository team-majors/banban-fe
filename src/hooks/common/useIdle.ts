import { useEffect } from "react";

type IdleCallback = () => void;

export function useIdle(callback: IdleCallback, deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const requestIdle =
      window.requestIdleCallback ??
      ((cb: IdleCallback) => window.setTimeout(cb, 1) as unknown as number);

    const cancelIdle =
      window.cancelIdleCallback ?? ((id: number) => clearTimeout(id));

    const id = requestIdle(callback);

    return () => {
      cancelIdle(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
