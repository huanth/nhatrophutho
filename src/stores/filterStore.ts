import { create } from "zustand";
import type { RoomFilters } from "@/types/room";

interface FilterState {
  filters: RoomFilters;
  setFilter: <K extends keyof RoomFilters>(key: K, value: RoomFilters[K]) => void;
  resetFilters: () => void;
  setFilters: (filters: RoomFilters) => void;
}

const defaultFilters: RoomFilters = {
  district: undefined,
  ward: undefined,
  roomType: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minArea: undefined,
  maxArea: undefined,
  sortBy: "newest",
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: { ...defaultFilters },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () =>
    set({ filters: { ...defaultFilters } }),
  setFilters: (filters) =>
    set({ filters: { ...defaultFilters, ...filters } }),
}));
