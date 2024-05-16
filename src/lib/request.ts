import axios from "axios";
import { IRegistartionFormData } from "./types/formDataTypes";
import { IUser, IAccount } from "./types/storeTypes";
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
  } catch (e) {
    console.log(e);
  }
}

async function makeRegistration(
  body: IRegistartionFormData
): Promise<IResponse<{ user: IUser; token: string }> | undefined> {
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

async function makeAuthorization(
  body: ILoginFormData
): Promise<IResponse<{ user: IUser; token: string }> | undefined> {
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
        url: `http://localhost:3001/account/${login}`,
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

export { checkLogin, makeRegistration, makeAuthorization, getAccountInfo };
