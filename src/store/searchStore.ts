import { create } from "zustand";
import { ISearchStore } from "./types/searchStoreTypes";

export const searchStore = create<ISearchStore>(set => ({
  isOpenedSearchDrawer: false,
  search: "",
  searchAccounts: [],
  recommendedAccounts: [],

  setIsOpenedSearchDrawer: value => set({ isOpenedSearchDrawer: value }),
  setSearch: text => set({ search: text }),
  setSearchAccounts: searchAccounts => set({ searchAccounts }),
  setRecommendedAccounts: recommendedAccounts => set({ recommendedAccounts }),
  setSubscriptionStatusOfRecommendedAccount: (login_of_following, status) =>
    set(state => ({
      recommendedAccounts: state.recommendedAccounts.map(account => {
        if (account.login === login_of_following) {
          account.follow_account = status;
          return account;
        } else {
          return account;
        }
      })
    }))
}));
