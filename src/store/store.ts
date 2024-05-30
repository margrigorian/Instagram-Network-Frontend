import { create } from "zustand";
import { IUserStore, IAccountStore } from "../lib/types/storeTypes";

export const userStore = create<IUserStore>(set => ({
  user: null,
  token: null,

  setUser: obj => set({ user: obj }),
  setAvatar: image =>
    set(state => ({
      user: state.user ? { ...state.user, avatar: image } : null
    })),
  setToken: token => set({ token: token })
}));

export const accountStore = create<IAccountStore>(set => ({
  user: null,
  followers: [],
  following: [],
  posts: [],

  setUser: obj => set({ user: obj }),
  setFollowers: arr => set({ followers: arr }),
  setFollowing: arr => set({ following: arr }),
  setPosts: arr => set({ posts: arr })
}));
