import { useMemo } from "react";

export const useTodayISO = () => {
  return useMemo(() => new Date().toISOString().split("T")[0], []);
};
