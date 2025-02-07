import { IUser } from "./userStoreTypes";
import { IPost } from "./postStoreTypes";

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
  decreaseFollowersCount: () => void;
  increaseFollowingsCount: () => void;
  decreaseFollowingsCount: () => void;
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

export interface IFollowerOrFollowing {
  login: string;
  username: string | null;
  avatar: string | null;
  verification: boolean;
  follow_account?: boolean;
}
