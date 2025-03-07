import { IAccount } from "./accountStoreTypes";
import { IPost } from "./postStoreTypes";

export interface ISearchAccount {
  login: string;
  username: string | null;
  avatar: string | null;
  verification: boolean;
  follow_account?: boolean;
}

export interface ISearchStore {
  isOpenedSearchDrawer: boolean;
  search: string;
  searchAccounts: ISearchAccount[];

  setIsOpenedSearchDrawer: (value: boolean) => void;
  setSearch: (text: string) => void;
  setSearchAccounts: (accounts: ISearchAccount[]) => void;
}

export interface IAccountInfoWithSearchAccounts {
  accountInfo: IAccount | null;
  searchAccounts: ISearchAccount[];
}

export interface IExploredPostsWithSearchAccounts {
  exploredPosts: IPost[];
  searchAccounts: ISearchAccount[];
}
