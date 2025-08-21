import { create } from "zustand";

interface ScrollStoreProps {
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;
}

const useScrollPositionStore = create<ScrollStoreProps>((set) => ({
  scrollPosition: 0,
  setScrollPosition: (pos: number) => set({ scrollPosition: pos }),
}));

export default useScrollPositionStore;
