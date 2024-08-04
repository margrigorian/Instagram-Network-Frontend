import { create } from "zustand";
import { IUserStore, IAccountStore, INewPostStore } from "../lib/types/storeTypes";

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
  setPosts: arr => set({ posts: arr }),
  addNewPost: post =>
    set(state => ({
      posts: [post, ...state.posts]
    }))
}));

export const newPostStore = create<INewPostStore>(set => ({
  isOpenedNewPostModalWindow: false,
  isOpenedModalWindowOfReadyNewPost: false,
  images: [],
  isOpenedCollectionOfImagesWindow: false,
  indexOfCurrentImage: 0,
  postCaption: "",

  setIsOpenedNewPostModalWindow: value =>
    set({
      isOpenedNewPostModalWindow: value
    }),
  setIsOpenedModalWindowOfReadyNewPost: value =>
    set({
      isOpenedModalWindowOfReadyNewPost: value
    }),
  setImages: image =>
    set(state => ({
      images: [...state.images, image]
    })),
  setIsOpenedCollectionOfImagesWindow: value =>
    set({
      isOpenedCollectionOfImagesWindow: value
    }),
  deleteCurrentImage: index =>
    set(state => ({
      images: state.images.filter((el, i) => i !== index)
    })),
  deleteAllImages: () => set({ images: [] }),
  setIndexOfCurrentImage: index => set({ indexOfCurrentImage: index }),
  setPostCaption: text => set({ postCaption: text })
}));
