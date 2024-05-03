export interface IUserStore {
  user: IUser | null;
  token: string | null;

  setUser: (obj: IUser) => void;
  setToken: (token: string) => void;
}

export interface IUser {
  id: number;
  login: string;
  username: string | null;
  avatar: string | null;
  about: string | null;
  gender: string | null;
  verification: boolean;
  recommendation: boolean;
}
