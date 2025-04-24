import { IListedAccount } from "./accountStoreTypes";

export interface IChatsStore {
  inbox: IChat[];
  paramForGettingInbox: boolean;
  inboxLoading: boolean;
  idOfActiveChat: number;
  currentChatMessages: IDateSortedMessages[];
  inputMessages: { chatId: number; message: string }[];
  isOpenedMessageModalWindow: boolean;
  setInbox: (chats: IChat[]) => void;
  setParamForGettingInbox: (value: boolean) => void;
  setInboxLoading: (value: boolean) => void;
  changeLastMessageOfChatInInbox: (message: IMessage) => void;
  deleteLastMessageOfChatInInbox: (chatId: number) => void;
  readLastMessageInInboxChat: (chatId: number) => void;
  setIdOfActiveChat: (id: number) => void;
  addChat: (chat: IChat) => void;
  setCurrentChatMessages: (messages: IDateSortedMessages[]) => void;
  addInputMessage: (chatId: number, message: string) => void;
  changeInputMessage: (chatId: number, message: string) => void;
  clearInputMessages: () => void;
  readMessageInCurrentChat: (messageId: number) => void;
  deleteMessageInCurrentChat: (messageId: number) => void;
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
  chat_id: number;
  is_read: boolean;
}

export interface IDateSortedMessages {
  time: number;
  messages: IMessage[];
}

export interface IInboxAlongWithSearchAccounts {
  chats: IChat[];
  searchAccounts: IListedAccount[];
}

export interface IInboxAlongWithCurrentChatMessagesAndSearchAccounts
  extends IInboxAlongWithSearchAccounts {
  currentChatMessages: IMessage[];
}
