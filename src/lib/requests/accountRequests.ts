import axios from "axios";
import { IAccount } from "../types/storeTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

async function getAccountInfo(login: string | undefined): Promise<IResponse<IAccount> | null> {
  try {
    // useParams имеет тип string | undefined
    if (login) {
      const data = await axios({
        method: "get",
        url: `http://localhost:3001/accounts/${login}`,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      });

      return data.data.data;
    } else {
      return null;
    }
  } catch (err) {
    // из ошибки не получается вытащить body
    console.log(err);
    // чтобы на фронте отрисовать отсутствие такого аккаунта
    return null;
  }
}

async function postSubscriptionOnAccount(login: string, token: string): Promise<void> {
  try {
    const subscription = await axios({
      method: "post",
      url: `http://localhost:3001/accounts/${login}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    console.log(subscription.data.data);
  } catch (e) {
    console.log(e);
  }
}

export { getAccountInfo, postSubscriptionOnAccount };
