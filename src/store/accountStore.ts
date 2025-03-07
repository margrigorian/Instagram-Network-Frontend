import { create } from "zustand";
import { IAccountStore } from "./types/accountStoreTypes";

export const accountStore = create<IAccountStore>(set => ({
  user: null,
  followers_count: 0,
  followings_count: 0,
  isOpenedFollowersAndFollowingsModalWindow: false,
  isOpenedAuthorizationWarningModalWindow: false,
  reloudAccountPage: false,

  setUser: obj => set({ user: obj }),
  setFollowersCount: value => set({ followers_count: value }),
  setFollowingsCount: value => set({ followings_count: value }),
  increaseFollowersCount: () => set(state => ({ followers_count: state.followers_count + 1 })),
  decreaseFollowersCount: () => set(state => ({ followers_count: state.followers_count - 1 })),
  increaseFollowingsCount: () => set(state => ({ followings_count: state.followings_count + 1 })),
  decreaseFollowingsCount: () => set(state => ({ followings_count: state.followings_count - 1 })),
  setIsOpenedFollowersAndFollowingsModalWindow: value =>
    set({ isOpenedFollowersAndFollowingsModalWindow: value }),
  setIsOpenedAuthorizationWarningModalWindow: value =>
    set({ isOpenedAuthorizationWarningModalWindow: value }),
  setReloudAccountPage: () => set(state => ({ reloudAccountPage: !state.reloudAccountPage }))
}));
