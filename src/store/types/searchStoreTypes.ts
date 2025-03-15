import { IListedAccount, IRecommendedAccount } from "./accountStoreTypes";

export interface ISearchStore {
  isOpenedSearchDrawer: boolean;
  search: string;
  searchAccounts: IListedAccount[];
  recommendedAccounts: IRecommendedAccount[];

  setIsOpenedSearchDrawer: (value: boolean) => void;
  setSearch: (text: string) => void;
  setSearchAccounts: (accounts: IListedAccount[]) => void;
  setRecommendedAccounts: (accounts: IRecommendedAccount[]) => void;
  setSubscriptionStatusOfRecommendedAccount: (login_of_following: string, status: boolean) => void;
}
