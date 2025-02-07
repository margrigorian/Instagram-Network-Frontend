import { create } from "zustand";
import { IAccountStore } from "./types/accountStoreTypes";

export const accountStore = create<IAccountStore>(set => ({
  user: null,
  followers_count: 0,
  followings_count: 0,
  posts: [],
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
  setPosts: arr => set({ posts: arr }),
  addNewPost: post =>
    set(state => ({
      posts: [post, ...state.posts]
    })),
  updatePostInStore: (post_id, caption, hashtags, user_links) =>
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === post_id) {
          post.caption = caption;
          post.hashtags = hashtags;
          post.user_links = user_links;
          return post;
        } else {
          return post;
        }
      })
    })),
  increaseCommentsNumberAfterAdding: post_id =>
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === post_id) {
          post.comments_number += 1;
          return post;
        } else {
          return post;
        }
      })
    })),
  decreaseCommentsNumberAfterDeleting: (post_id, number_of_comments) =>
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === post_id) {
          post.comments_number -= number_of_comments;
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
  deleteLikeFromPostInStore: (post_id, login) =>
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === post_id) {
          post.likes = post.likes.filter(user_login => user_login !== login);
          return post;
        } else {
          return post;
        }
      })
    })),
  deleteImageOfPostInStore: (post_id, img_index) =>
    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === post_id) {
          post.images = post.images.filter(image => image.img_index !== img_index);
          return post;
        } else {
          return post;
        }
      })
    })),
  deletePostFromStore: post_id =>
    set(state => ({
      posts: state.posts.filter(post => post.id !== post_id)
    })),
  setIsOpenedFollowersAndFollowingsModalWindow: value =>
    set({ isOpenedFollowersAndFollowingsModalWindow: value }),
  setIsOpenedAuthorizationWarningModalWindow: value =>
    set({ isOpenedAuthorizationWarningModalWindow: value }),
  setReloudAccountPage: () => set(state => ({ reloudAccountPage: !state.reloudAccountPage }))
}));
