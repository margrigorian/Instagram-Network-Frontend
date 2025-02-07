import { create } from "zustand";
import { IPostStore, IStoreOfEditedPost } from "./types/postStoreTypes";

export const postStore = create<IPostStore>(set => ({
  isOpenedPostModalWindow: false,
  indexOfCurrentPost: 0,
  comments: [],
  isOpenedCommentMenu: false,
  currentComment: null,
  isOpenedPostMenu: false,
  isOpenedPostEditModalWindow: false,

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
    })),
  setIsOpenedCommentMenu: value =>
    set({
      isOpenedCommentMenu: value
    }),
  setCurrentComment: obj =>
    set({
      currentComment: obj
    }),
  deleteCommentFromStore: comment_id =>
    set(state => ({
      comments: state.comments.filter(el => el.id !== comment_id)
    })),
  deleteSubcommentFromStore: (subcomment_id, under_comment) =>
    set(state => ({
      comments: state.comments.map(comment => {
        if (comment.id === under_comment) {
          comment.subcomments = comment.subcomments?.filter(
            subcomment => subcomment.id !== subcomment_id
          );
          return comment;
        } else {
          return comment;
        }
      })
    })),
  deleteLikeFromCommentInStore: (comment_id, login) =>
    set(state => ({
      comments: state.comments.map(comment => {
        if (comment.id === comment_id) {
          comment.likes = comment.likes.filter(user_login => user_login !== login);
          return comment;
        } else {
          return comment;
        }
      })
    })),
  deleteLikeFromSubcommentInStore: (subcomment_id, under_comment, login) =>
    set(state => ({
      comments: state.comments.map(comment => {
        if (comment.id === under_comment) {
          comment.subcomments = comment.subcomments?.map(subcomment => {
            if (subcomment.id === subcomment_id) {
              subcomment.likes = subcomment.likes.filter(user_login => user_login !== login);
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
    })),
  setIsOpenedPostMenu: value => set({ isOpenedPostMenu: value }),
  setIsOpenedPostEditModalWindow: value => set({ isOpenedPostEditModalWindow: value })
}));

export const storeOfEditedPost = create<IStoreOfEditedPost>(set => ({
  isOpenedNewPostModalWindow: false,
  isOpenedModalWindowOfReadyNewPost: false,
  files: [],
  isOpenedCollectionOfImagesWindow: false,
  postId: null,
  indexOfCurrentImage: 0,
  postCaption: "",
  imagesOfEditedPost: [],

  setIsOpenedNewPostModalWindow: value =>
    set({
      isOpenedNewPostModalWindow: value
    }),
  setIsOpenedModalWindowOfReadyNewPost: value =>
    set({
      isOpenedModalWindowOfReadyNewPost: value
    }),
  setFiles: file =>
    set(state => ({
      files: [...state.files, file]
    })),
  setIsOpenedCollectionOfImagesWindow: value =>
    set({
      isOpenedCollectionOfImagesWindow: value
    }),
  deleteCurrentFile: index =>
    set(state => ({
      files: state.files.filter((el, i) => i !== index)
    })),
  deleteAllFiles: () => set({ files: [] }),
  setPostId: id => set({ postId: id }),
  setIndexOfCurrentImage: index => set({ indexOfCurrentImage: index }),
  setPostCaption: text => set({ postCaption: text }),
  setImagesOfEditedPost: images => set({ imagesOfEditedPost: images }),
  deleteImageInEditedPost: index =>
    set(state => ({
      imagesOfEditedPost: state.imagesOfEditedPost.filter(image => image.img_index !== index)
    }))
}));
