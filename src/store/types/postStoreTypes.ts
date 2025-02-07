export interface IPost {
  id: string;
  caption: string;
  hashtags: string[];
  user_links: string[];
  time: number;
  user_login: string;
  avatar: string;
  verification: boolean;
  likes: string[];
  comments_number: number;
  images: IImage[];
}

interface IImage {
  img_index: number;
  image: string;
}

export interface IPostStore {
  isOpenedPostModalWindow: boolean;
  indexOfCurrentPost: number;
  comments: IComment[];
  isOpenedCommentMenu: boolean;
  currentComment: ICurrentComment | null;
  isOpenedPostMenu: boolean;
  isOpenedPostEditModalWindow: boolean;
  setIsOpenedPostModalWindow: (value: boolean) => void;
  setIndexOfCurrentPost: (index: number) => void;
  setComments: (array: IComment[]) => void;
  addComment: (newComment: IComment) => void;
  addLikeOnComment: (comment_id: number, login: string) => void;
  addLikeOnSubcomment: (under_comment: number, comment_id: number, login: string) => void;
  setIsOpenedCommentMenu: (value: boolean) => void;
  setCurrentComment: (value: ICurrentComment) => void;
  deleteCommentFromStore: (comment_id: number) => void;
  deleteSubcommentFromStore: (subcomment_id: number, under_comment: number) => void;
  deleteLikeFromCommentInStore: (comment_id: number, login: string) => void;
  deleteLikeFromSubcommentInStore: (
    comment_id: number,
    under_comment: number,
    login: string
  ) => void;
  setIsOpenedPostMenu: (value: boolean) => void;
  setIsOpenedPostEditModalWindow: (value: boolean) => void;
}

export interface IStoreOfEditedPost {
  isOpenedNewPostModalWindow: boolean;
  isOpenedModalWindowOfReadyNewPost: boolean;
  // объединить File и IImage в один массив images не получается, в компонентах возникают сложности
  files: File[];
  isOpenedCollectionOfImagesWindow: boolean;
  postId: string | null;
  indexOfCurrentImage: number;
  postCaption: string;
  imagesOfEditedPost: IImage[];
  setIsOpenedNewPostModalWindow: (value: boolean) => void;
  setIsOpenedModalWindowOfReadyNewPost: (value: boolean) => void;
  setFiles: (value: File) => void;
  setIsOpenedCollectionOfImagesWindow: (value: boolean) => void;
  deleteCurrentFile: (index: number) => void;
  deleteAllFiles: () => void;
  setPostId: (id: string) => void;
  setIndexOfCurrentImage: (index: number) => void;
  setPostCaption: (text: string) => void;
  setImagesOfEditedPost: (images: IImage[]) => void;
  deleteImageInEditedPost: (index: number) => void;
}

export interface IComment {
  id: number;
  content: string;
  hashtags: string[];
  user_links: string[];
  under_comment: number;
  user_login: string;
  avatar: string | null;
  verification: boolean;
  likes: string[];
  subcomments?: IComment[];
}

interface ICurrentComment {
  comment_id: number;
  under_comment: number | null;
  user_login: string;
  number_of_subcomments: number;
}
