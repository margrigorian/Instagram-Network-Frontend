import axios from "axios";
import { IRegistartionFormData } from "./types/formDataTypes";
import { IUser, IAccount, IAvatar, IPost } from "./types/storeTypes";
import { ILoginFormData } from "./types/formDataTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

async function checkLogin(login: string): Promise<IResponse<{ login: string | null }> | undefined> {
  try {
    const data = await axios.get(`http://localhost:3001/register/${login}`);

    return data.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function makeRegistration(body: IRegistartionFormData): Promise<
  | IResponse<{
      user: IUser;
      followers: { login: string }[];
      following: { login: string }[];
      token: string;
    }>
  | undefined
> {
  // undefined из-за catch
  try {
    const data = await axios({
      method: "post",
      url: "http://localhost:3001/register",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: JSON.stringify(body)
    });

    return data.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function makeAuthorization(body: ILoginFormData): Promise<
  | IResponse<{
      user: IUser;
      followers: { login: string }[];
      following: { login: string }[];
      token: string;
    }>
  | undefined
> {
  try {
    const data = await axios({
      method: "post",
      url: "http://localhost:3001/",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: JSON.stringify(body)
    });

    return data.data.data;
  } catch (err) {
    console.log(err);
  }
}

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
  body: {
    about: string;
    gender: string | null;
    recommendation: boolean;
  },
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

async function postPublication(
  data: FormData,
  token: string
): Promise<IResponse<IPost> | undefined> {
  try {
    const publication = await axios({
      method: "post",
      url: "http://localhost:3001/new_post",
      headers: {
        // Заголовок при отправке файлов, необходимо исп. FormData
        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
        authorization: `Bearer ${token}`
      },
      data
    });

    return publication.data.data;
  } catch (err) {
    console.log(err);
  }
}

async function getComments(post_id: string) {
  try {
    const comments = await axios({
      method: "get",
      url: `http://localhost:3001/p/${post_id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

    return comments.data.data;
  } catch (err) {
    console.log(err);
  }
}

export {
  checkLogin,
  makeRegistration,
  makeAuthorization,
  getAccountInfo,
  postAvatar,
  putAvatar,
  deleteAvatar,
  putUserInfo,
  postPublication,
  getComments
};
