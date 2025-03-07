import { IUser } from "./userStoreTypes";
import { IPost } from "./postStoreTypes";

export interface IAccount {
  user: IUser | null;
  followers_count: number;
  followings_count: number;
  // указание постов необходимо только для типизации
  // сами они сохраняются в postStore
  posts?: IPost[];
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
  setIsOpenedFollowersAndFollowingsModalWindow: (value: boolean) => void;
  setIsOpenedAuthorizationWarningModalWindow: (value: boolean) => void;
  setReloudAccountPage: () => void;
}
