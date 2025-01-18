import axios from "axios";
import { IPost } from "../types/storeTypes";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

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

async function addLikeToPost(post_id: string, token: string): Promise<void> {
  try {
    const like = await axios({
      method: "post",
      url: `http://localhost:3001/p/${post_id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    console.log(like.data.data);
  } catch (e) {
    console.log(e);
  }
}

export { postPublication, addLikeToPost };
