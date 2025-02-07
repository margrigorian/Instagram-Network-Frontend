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
  deleteFollowing: (login: string) => void;
}

export interface IAvatar {
  user_login: string;
  image: string;
}
