import axios from "axios";
import { IAccount, IFollowerOrFollowing } from "../../store/types/accountStoreTypes";

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

async function getAccounts(
  login: string,
  path: string,
  search: string,
  token: string
): Promise<IFollowerOrFollowing[] | undefined> {
  try {
    let searchParam = "";
    if (search) {
      searchParam = `search=${search}`;
    }

    const accounts = await axios({
      method: "get",
      url: `http://localhost:3001/accounts/${login}/${path}?${searchParam}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    return accounts.data.data.data;
  } catch (e) {
    console.log(e);
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

async function postSubscriptionOnFollowerOrFollowing(
  acoount_login: string,
  path: string,
  login_of_following: string,
  token: string
): Promise<void> {
  try {
    const subscription = await axios({
      method: "post",
      url: `http://localhost:3001/accounts/${acoount_login}/${path}?login_of_following=${login_of_following}`,
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

async function deleteSubscriptionOnAccount(login: string, token: string): Promise<void> {
  try {
    const subscription = await axios({
      method: "delete",
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

async function deleteFollowerOrSubscription(
  acoount_login: string,
  path: string,
  login_of_following: string,
  token: string
): Promise<void> {
  try {
    const subscription = await axios({
      method: "delete",
      url: `http://localhost:3001/accounts/${acoount_login}/${path}?login_of_following=${login_of_following}`,
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

export {
  getAccountInfo,
  getAccounts,
  postSubscriptionOnAccount,
  postSubscriptionOnFollowerOrFollowing,
  deleteSubscriptionOnAccount,
  deleteFollowerOrSubscription
};
