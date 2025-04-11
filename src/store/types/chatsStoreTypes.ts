import { IListedAccount } from "./accountStoreTypes";

export interface IChatsStore {
  inbox: IChat[];
  isOpenedMessageModalWindow: boolean;
  setInbox: (chats: IChat[]) => void;
  addChat: (chat: IChat) => void;
  setIsOpenedMessageModalWindow: (value: boolean) => void;
}

export interface IChat {
  id: number;
  participants: IListedAccount[];
  type: string;
  creators: string;
  deleted_from: string | null;
  last_message?: IMessage;
}

export interface IMessage {
  id: number;
  message: string;
  sender: IListedAccount;
  time: number;
  is_read: boolean;
}

export interface IChatsWithSearchAccounts {
  chats: IChat[];
  searchAccounts: IListedAccount[];
}
