import { create } from "zustand";

interface FloatingModalState {
  isFloatingModalOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

export const useFloatingModalStore = create<FloatingModalState>((set) => ({
  isFloatingModalOpen: false,
  setOpen: () => set({ isFloatingModalOpen: true }),
  setClose: () => set({ isFloatingModalOpen: false }),
}));
