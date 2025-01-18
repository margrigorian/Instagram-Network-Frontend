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
  isOpenedAuthorizationWarningModalWindow: false,
  reloudAccountPage: false,

  setUser: obj => set({ user: obj }),
  setFollowers: arr => set({ followers: arr }),
  setFollowing: arr => set({ following: arr }),
  setPosts: arr => set({ posts: arr }),
  addNewPost: post =>
    set(state => ({
      posts: [post, ...state.posts]
    })),
  increaseCommentsNumberAfterAdding: id =>
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === id) {
          post.comments_number += 1;
          return post;
        } else {
          return post;
        }
      })
    })),
  addLikeOnPost: (post_id, login) =>
    set(state => ({
      posts: state.posts.map(el => {
        if (el.id === post_id) {
          el.likes = [...el.likes, login];
          return el;
        } else {
          return el;
        }
      })
    })),
  setIsOpenedAuthorizationWarningModalWindow: value =>
    set({ isOpenedAuthorizationWarningModalWindow: value }),
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
    }),
  addComment: newComment =>
    set(state => ({
      comments:
        newComment.under_comment === null
          ? [...state.comments, newComment]
          : state.comments.map(comment => {
              if (comment.id === newComment.under_comment) {
                // проверка, требуемая типизацией
                if (comment.subcomments) {
                  comment.subcomments = [...comment.subcomments, newComment];
                }
                return comment;
              } else {
                return comment;
              }
            })
    })),
  addLikeOnComment: (comment_id, login) =>
    set(state => ({
      comments: state.comments.map(el => {
        if (el.id === comment_id) {
          el.likes = [...el.likes, login];
          return el;
        } else {
          return el;
        }
      })
    })),
  addLikeOnSubcomment: (under_comment, comment_id, login) =>
    set(state => ({
      comments: state.comments.map(comment => {
        if (comment.id === under_comment) {
          comment.subcomments?.map(subcomment => {
            if (subcomment.id === comment_id) {
              subcomment.likes = [...subcomment.likes, login];
              return subcomment;
            } else {
              return subcomment;
            }
          });
          return comment;
        } else {
          return comment;
        }
      })
    }))
}));
