import { create } from "zustand";
import { IChatsStore } from "./types/chatsStoreTypes";

export const chatsStore = create<IChatsStore>(set => ({
  inbox: [],
  isOpenedMessageModalWindow: false,

  setInbox: chats => set({ inbox: chats }),
  addChat: chat => set(state => ({ inbox: [chat, ...state.inbox] })),
  setIsOpenedMessageModalWindow: value => set({ isOpenedMessageModalWindow: value })
}));
