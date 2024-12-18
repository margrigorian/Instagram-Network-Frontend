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
  following: { login: string }[];
  token: string | null;

  setUser: (obj: IUser) => void;
  setFollowers: (array: { login: string }[]) => void;
  setFollowing: (array: { login: string }[]) => void;
  setAvatar: (image: string | null) => void;
  setToken: (token: string) => void;
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
  followers: { login: string }[];
  following: { login: string }[];
  posts: IPost[];
  reloudAccountPage: boolean;
}

export interface IAccountStore extends IAccount {
  setUser: (obj: IUser | null) => void;
  setFollowers: (arr: { login: string }[]) => void;
  setFollowing: (arr: { login: string }[]) => void;
  setPosts: (arr: IPost[]) => void;
  addNewPost: (post: IPost) => void;
  setReloudAccountPage: () => void;
}

export interface INewPostStore {
  isOpenedNewPostModalWindow: boolean;
  isOpenedModalWindowOfReadyNewPost: boolean;
  images: File[];
  isOpenedCollectionOfImagesWindow: boolean;
  indexOfCurrentImage: number;
  postCaption: string;
  setIsOpenedNewPostModalWindow: (value: boolean) => void;
  setIsOpenedModalWindowOfReadyNewPost: (value: boolean) => void;
  setImages: (image: File) => void;
  setIsOpenedCollectionOfImagesWindow: (value: boolean) => void;
  deleteCurrentImage: (index: number) => void;
  deleteAllImages: () => void;
  setIndexOfCurrentImage: (index: number) => void;
  setPostCaption: (text: string) => void;
}

export interface IPostStore {
  isOpenedPostModalWindow: boolean;
  indexOfCurrentPost: number;
  comments: IComment[];
  setIsOpenedPostModalWindow: (value: boolean) => void;
  setIndexOfCurrentPost: (index: number) => void;
  setComments: (array: IComment[]) => void;
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
  subcomments: IComment[];
}
