import { create } from "zustand";

interface ScrollStoreProps {
  positions: Record<string, number>;
  getPosition: (key: string) => number;
  setPosition: (key: string, pos: number) => void;
  clearPosition: (key: string) => void;
}

const useScrollPositionStore = create<ScrollStoreProps>((set, get) => ({
  positions: {},
  getPosition: (key: string) => get().positions[key] ?? 0,
  setPosition: (key: string, pos: number) =>
    set((state) => ({ positions: { ...state.positions, [key]: pos } })),
  clearPosition: (key: string) =>
    set((state) => {
      const next = { ...state.positions };
      delete next[key];
      return { positions: next };
    }),
}));

export default useScrollPositionStore;
