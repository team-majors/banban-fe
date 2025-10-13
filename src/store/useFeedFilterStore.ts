import {create} from "zustand";
import type {FilterType, SortBy, SortOrder} from "@/types/feeds";

interface FeedFilterState {
  sortBy: SortBy;
  sortOrder: SortOrder;
  filterType: FilterType;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setFilterType: (filterType: FilterType) => void;
  reset: () => void;
}

export const useFeedFilterStore = create<FeedFilterState>((set) => ({
  sortBy: "created",
  sortOrder: "desc",
  filterType: "all",

  setSortBy: (sortBy) => set({sortBy}),
  setSortOrder: (sortOrder) => set({sortOrder}),
  setFilterType: (filterType) => set({filterType}),

  reset: () =>
      set({
        sortBy: "created",
        sortOrder: "desc",
        filterType: "all",
      }),
}));
