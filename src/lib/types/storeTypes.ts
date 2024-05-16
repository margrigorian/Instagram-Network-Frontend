export interface IUser {
  id: number;
  login: string;
  username: string | null;
  avatar: string | null;
  about?: string | null; // информаиця понадобится только при просмотре страницы
  gender?: string | null;
  verification: boolean;
  recommendation: boolean; // рекомендации другого пользователя не должны присутствовать
}

export interface IUserStore {
  user: IUser | null;
  token: string | null;

  setUser: (obj: IUser) => void;
  setToken: (token: string) => void;
}

interface IPost {
  id: string;
  likes_number: number;
  comments_number: number;
  images: IImage[];
}

interface IImage {
  img_index: number;
  image: string;
}

export interface IAccount {
  user: IUser | null;
  followers: { id: number }[];
  following: { login: string }[];
  posts: IPost[];
}

export interface IAccountStore extends IAccount {
  setUser: (obj: IUser | null) => void;
  setFollowers: (arr: { id: number }[]) => void;
  setFollowing: (arr: { login: string }[]) => void;
  setPosts: (arr: IPost[]) => void;
}
