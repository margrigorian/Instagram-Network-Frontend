import axios from "axios";
import { IChat, IChatsWithSearchAccounts } from "../../store/types/chatsStoreTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

async function getChatsWithSearchAccounts(
  search: string,
  token: string
): Promise<IResponse<IChatsWithSearchAccounts> | undefined> {
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

export { getChatsWithSearchAccounts, createChat };
