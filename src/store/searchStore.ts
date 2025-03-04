import { create } from "zustand";
import { ISearchStore } from "./types/searchStoreTypes";

export const searchStore = create<ISearchStore>(set => ({
  isOpenedSearchDrawer: false,
  search: "",
  searchAccounts: [],

  setIsOpenedSearchDrawer: value => set({ isOpenedSearchDrawer: value }),
  setSearch: text => set({ search: text }),
  setSearchAccounts: searchAccounts => set({ searchAccounts: searchAccounts })
}));
