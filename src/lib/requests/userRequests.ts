import axios from "axios";
import { IUserInfoBody } from "./types/bodyTypesRequested";
import { IUser, IAvatar } from "../../store/types/userStoreTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

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

async function deleteAvatarOrAccount(token: string, key = ""): Promise<void> {
  try {
    let param = "";
    if (key === "avatar") {
      param = `?avatar=false`;
    }

    const data = await axios({
      method: "delete",
      url: `http://localhost:3001/profile/edit${param}`,
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

export { postAvatar, putAvatar, deleteAvatarOrAccount, putUserInfo };
