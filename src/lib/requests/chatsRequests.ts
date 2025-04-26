import axios from "axios";
import {
  IMessage,
  IChat,
  IInboxAlongWithSearchAccounts,
  IInboxAlongWithCurrentChatMessagesAndSearchAccounts,
  IDeletedGroupParticipant
} from "../../store/types/chatsStoreTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

async function getInboxAlongWithSearchAccounts(
  search: string,
  token: string
): Promise<IResponse<IInboxAlongWithSearchAccounts> | undefined> {
  try {
    let searchParam = "";
    if (search) {
      searchParam = `?search=${search}`;
    }

    const data = await axios({
      method: "get",
      url: `http://localhost:3001/direct${searchParam}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    return data.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function getInboxAlongWithCurrentChatMessagesAndSearchAccounts(
  chatId: string,
  paramForGettingInbox: boolean,
  search: string,
  token: string
): Promise<IResponse<IInboxAlongWithCurrentChatMessagesAndSearchAccounts> | undefined> {
  try {
    let searchParam = "";
    if (search) {
      searchParam = `&search=${search}`;
    }

    const data = await axios({
      method: "get",
      url: `http://localhost:3001/direct/${chatId}?inbox=${paramForGettingInbox}${searchParam}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    return data.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function createChat(body: string[], token: string): Promise<IResponse<IChat> | undefined> {
  try {
    const chat = await axios({
      method: "post",
      url: `http://localhost:3001/direct`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      },
      data: JSON.stringify({ participants: body })
    });

    return chat.data.data;
  } catch (e) {
    console.log(e);
  }
}

async function postMessage(
  message: string,
  time: number,
  chatId: number,
  token: string
): Promise<IResponse<IMessage> | undefined> {
  try {
    const postedMessage = await axios({
      method: "post",
      url: `http://localhost:3001/direct/${chatId}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      },
      data: JSON.stringify({ message, time })
    });

    return postedMessage.data.data;
  } catch (e) {
    console.log(e);
  }
}

async function readMessage(chatId: number, messageId: number, token: string): Promise<void> {
  try {
    const readMessage = await axios({
      method: "delete",
      url: `http://localhost:3001/direct/${chatId}?readMessageId=${messageId}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    console.log(readMessage.data.data);
  } catch (e) {
    console.log(e);
  }
}

async function deleteMesseageOrGroupParticipantOrChat(
  chatId: number,
  messageId: number | null,
  groupParticipant: string | null,
  token: string
): Promise<IResponse<IMessage | IDeletedGroupParticipant | IChat> | undefined> {
  try {
    let messageIdQueryParam = "";
    if (messageId) {
      messageIdQueryParam = `?messageId=${messageId}`;
    }
    let groupParticipantQueryParam = "";
    if (groupParticipant) {
      groupParticipantQueryParam = `?participant=${groupParticipant}`;
    }

    const deletedElement = await axios({
      method: "delete",
      url: `http://localhost:3001/direct/${chatId}${messageIdQueryParam}${groupParticipantQueryParam}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    return deletedElement.data.data;
  } catch (e) {
    console.log(e);
  }
}

export {
  getInboxAlongWithSearchAccounts,
  getInboxAlongWithCurrentChatMessagesAndSearchAccounts,
  createChat,
  postMessage,
  readMessage,
  deleteMesseageOrGroupParticipantOrChat
};
