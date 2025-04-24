import { create } from "zustand";
import { IChatsStore } from "./types/chatsStoreTypes";

export const chatsStore = create<IChatsStore>(set => ({
  inbox: [],
  // true сработает при полной перезагрузке страницы
  // в остальных случаях будет смена на false, чтобы повторно не запрашивался inbox
  paramForGettingInbox: true,
  inboxLoading: true,
  idOfActiveChat: 0,
  currentChatMessages: [],
  inputMessages: [],
  isOpenedMessageModalWindow: false,

  setInbox: chats => set({ inbox: chats }),
  setParamForGettingInbox: value => set({ paramForGettingInbox: value }),
  setInboxLoading: value => set({ inboxLoading: value }),
  changeLastMessageOfChatInInbox: message =>
    set(state => ({
      inbox: state.inbox.map(chat => {
        if (chat.id === message.chat_id) {
          chat.last_message = message;
          return chat;
        } else {
          return chat;
        }
      })
    })),
  deleteLastMessageOfChatInInbox: chatId =>
    set(state => ({
      inbox: state.inbox.map(chat => {
        if (chat.id === chatId) {
          delete chat.last_message;
          return chat;
        } else {
          return chat;
        }
      })
    })),
  readLastMessageInInboxChat: chatId =>
    set(state => ({
      inbox: state.inbox.map(chat => {
        if (chat.id === chatId && chat.last_message) {
          chat.last_message.is_read = true;
          return chat;
        } else {
          return chat;
        }
      })
    })),
  setIdOfActiveChat: id => set({ idOfActiveChat: id }),
  addChat: chat => set(state => ({ inbox: [chat, ...state.inbox] })),
  setCurrentChatMessages: messages => set({ currentChatMessages: messages }),
  addInputMessage: (chatId, message) =>
    set(state => ({ inputMessages: [...state.inputMessages, { chatId, message }] })),
  changeInputMessage: (chatId, message) =>
    set(state => ({
      inputMessages: state.inputMessages.map(el => {
        if (el.chatId === chatId) {
          el.message = message;
          return el;
        } else {
          return el;
        }
      })
    })),
  clearInputMessages: () => set({ inputMessages: [] }),
  readMessageInCurrentChat: messageId =>
    set(state => ({
      currentChatMessages: state.currentChatMessages.map(messagesBlock => {
        messagesBlock.messages.map(el => {
          if (el.id === messageId) {
            el.is_read = true;
            return el;
          } else {
            return el;
          }
        });

        return messagesBlock;
      })
    })),
  deleteMessageInCurrentChat: messageId =>
    set(state => ({
      currentChatMessages: state.currentChatMessages
        .map(messagesBlock => {
          const message = messagesBlock.messages.find(el => el.id === messageId);
          if (message) {
            messagesBlock.messages = messagesBlock.messages.filter(el => el.id !== messageId);
          }
          return messagesBlock;
        })
        // исключаем временные блоки, если количество сообщений в них равно 0
        .filter(messagesBlock => messagesBlock.messages.length > 0)
    })),
  setIsOpenedMessageModalWindow: value => set({ isOpenedMessageModalWindow: value })
}));
