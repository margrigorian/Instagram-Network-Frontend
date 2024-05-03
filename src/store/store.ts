import { create } from "zustand";
import { IUserStore } from "../lib/types/storeTypes";

export const userStore = create<IUserStore>(set => ({
  user: null,
  token: null,

  setUser: obj => set({ user: obj }),
  setToken: token => set({ token: token })
}));
