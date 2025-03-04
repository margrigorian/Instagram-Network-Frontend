import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUserStore } from "./types/userStoreTypes";

export const userStore = create(
  persist<IUserStore>(
    set => ({
      user: null,
      followers: [],
      followings: [],
      token: null,

      setUser: obj => set({ user: obj }),
      setFollowers: followers => set({ followers: followers }),
      setFollowings: following => set({ followings: following }),
      setAvatar: image =>
        set(state => ({
          user: state.user ? { ...state.user, avatar: image } : null
        })),
      setToken: token => set({ token: token }),
      addFollowing: login =>
        set(state => ({
          followings: [...state.followings, { login }]
        })),
      deleteFollowing: login =>
        set(state => ({
          followings: state.followings.filter(account => account.login !== login)
        }))
    }),
    { name: "user-storage", storage: createJSONStorage(() => localStorage) }
  )
);
