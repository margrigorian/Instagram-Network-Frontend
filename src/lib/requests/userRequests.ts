import axios from "axios";
import { IUser, IAccount, IAvatar } from "../types/storeTypes";
import { IUserInfoBody } from "../types/bodyTypesRequested";

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

async function postAvatar(data: FormData, token: string): Promise<IResponse<IAvatar> | undefined> {
  try {
    const avatarInfo = await axios({
      method: "post",
      url: "http://localhost:3001/profile/edit",
      headers: {
        // Заголовок при отправке файлов, необходимо исп. FormData
        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
        authorization: `Bearer ${token}`
      },
      data
    });

    return avatarInfo.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function putAvatar(data: FormData, token: string): Promise<IResponse<IAvatar> | undefined> {
  try {
    const avatarInfo = await axios({
      method: "put",
      url: "http://localhost:3001/profile/edit",
      headers: {
        // Заголовок при отправке файлов, необходимо исп. FormData
        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
        authorization: `Bearer ${token}`
      },
      data
    });

    return avatarInfo.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function deleteAvatar(token: string): Promise<void> {
  try {
    const data = await axios({
      method: "delete",
      url: "http://localhost:3001/profile/edit",
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    console.log(data.data.data);
  } catch (err) {
    console.log(err);
  }
}

async function putUserInfo(
  body: IUserInfoBody,
  token: string
): Promise<IResponse<IUser> | undefined> {
  try {
    const data = await axios({
      method: "put",
      url: "http://localhost:3001/profile/edit",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      },
      data: JSON.stringify(body)
    });

    return data.data.data;
  } catch (err) {
    console.log(err);
  }
}

export { getAccountInfo, postAvatar, putAvatar, deleteAvatar, putUserInfo };
