export interface IUser {
  login: string;
  username: string | null;
  avatar: string | null;
  about: string;
  gender: string | null;
  verification: boolean;
  recommendation: boolean;
}

export interface IUserStore {
  user: IUser | null;
  followers: { login: string }[];
  followings: { login: string }[];
  token: string | null;

  setUser: (obj: IUser) => void;
  setFollowers: (array: { login: string }[]) => void;
  setFollowings: (array: { login: string }[]) => void;
  setAvatar: (image: string | null) => void;
  setToken: (token: string) => void;
  addFollowing: (login: string) => void;
}

export interface IAvatar {
  user_login: string;
  image: string;
}

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

export interface IAccount {
  user: IUser | null;
  followers_count: number;
  followings_count: number;
  posts: IPost[];
  isOpenedFollowersAndFollowingsModalWindow: boolean;
  isOpenedAuthorizationWarningModalWindow: boolean;
  reloudAccountPage: boolean;
}

export interface IAccountStore extends IAccount {
  setUser: (obj: IUser | null) => void;
  setFollowersCount: (value: number) => void;
  setFollowingsCount: (value: number) => void;
  increaseFollowersCount: () => void;
  increaseFollowingsCount: () => void;
  setPosts: (arr: IPost[]) => void;
  addNewPost: (post: IPost) => void;
  updatePostInStore: (
    post_id: string,
    caption: string,
    hashtags: string[],
    user_links: string[]
  ) => void;
  increaseCommentsNumberAfterAdding: (id: string) => void;
  decreaseCommentsNumberAfterDeleting: (post_id: string, number_of_comments: number) => void;
  addLikeOnPost: (post_id: string, login: string) => void;
  deleteLikeFromPostInStore: (post_id: string, login: string) => void;
  deleteImageOfPostInStore: (post_id: string, img_index: number) => void;
  deletePostFromStore: (post_id: string) => void;
  setIsOpenedFollowersAndFollowingsModalWindow: (value: boolean) => void;
  setIsOpenedAuthorizationWarningModalWindow: (value: boolean) => void;
  setReloudAccountPage: () => void;
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

export interface IFollowerOrFollowing {
  login: string;
  username: string | null;
  avatar: string | null;
  verification: boolean;
  follow_account?: boolean;
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
