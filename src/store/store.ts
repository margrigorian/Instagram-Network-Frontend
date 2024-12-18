import { create } from "zustand";
import { IUserStore, IAccountStore, INewPostStore, IPostStore } from "../lib/types/storeTypes";

export const userStore = create<IUserStore>(set => ({
  user: null,
  followers: [],
  following: [],
  token: null,

  setUser: obj => set({ user: obj }),
  setFollowers: followers => set({ followers: followers }),
  setFollowing: following => set({ following: following }),
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
  reloudAccountPage: false,

  setUser: obj => set({ user: obj }),
  setFollowers: arr => set({ followers: arr }),
  setFollowing: arr => set({ following: arr }),
  setPosts: arr => set({ posts: arr }),
  addNewPost: post =>
    set(state => ({
      posts: [post, ...state.posts]
    })),
  setReloudAccountPage: () => set(state => ({ reloudAccountPage: !state.reloudAccountPage }))
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

export const postStore = create<IPostStore>(set => ({
  isOpenedPostModalWindow: false,
  indexOfCurrentPost: 0,
  comments: [],

  setIsOpenedPostModalWindow: value =>
    set({
      isOpenedPostModalWindow: value
    }),
  setIndexOfCurrentPost: index =>
    set({
      indexOfCurrentPost: index
    }),
  setComments: array =>
    set({
      comments: array
    })
}));
