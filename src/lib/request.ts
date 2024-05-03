import axios from "axios";
import { IRegistartionFormData } from "./types/formDataTypes";
import { IUser } from "./types/storeTypes";
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

export { checkLogin, makeRegistration, makeAuthorization };
