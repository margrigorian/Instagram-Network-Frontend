import axios from "axios";
import {
  IAccountInfoWithSearchAccounts,
  IListedAccount
} from "../../store/types/accountStoreTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

async function getAccountInfoWithSearchAccounts(
  login: string,
  search: string
): Promise<IResponse<IAccountInfoWithSearchAccounts> | null> {
  try {
    let searchParam = "";
    if (search) {
      searchParam = `?search=${search}`;
    }

    const data = await axios({
      method: "get",
      url: `http://localhost:3001/accounts/${login}${searchParam}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

    return data.data.data;
  } catch (err) {
    // из ошибки не получается вытащить body
    console.log(err);
    // чтобы на фронте отрисовать отсутствие такого аккаунта
    return null;
  }
}

async function getSearchAccounts(
  search: string,
  token: string
): Promise<IListedAccount[] | undefined> {
  try {
    let searchParam = "";
    if (search) {
      searchParam = `?search=${search}`;
    }

    const accounts = await axios({
      method: "get",
      url: `http://localhost:3001/profile/edit${searchParam}`,
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

async function getFollowersOrFollowings(
  login: string,
  path: string,
  search: string,
  token: string
): Promise<IListedAccount[] | undefined> {
  try {
    let searchParam = "";
    if (search) {
      searchParam = `?search=${search}`;
    }

    const accounts = await axios({
      method: "get",
      url: `http://localhost:3001/accounts/${login}/${path}${searchParam}`,
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
  getAccountInfoWithSearchAccounts,
  getSearchAccounts,
  getFollowersOrFollowings,
  postSubscriptionOnAccount,
  postSubscriptionOnFollowerOrFollowing,
  deleteSubscriptionOnAccount,
  deleteFollowerOrSubscription
};
