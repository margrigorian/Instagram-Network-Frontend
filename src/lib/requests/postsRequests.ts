import axios from "axios";
import { IPost } from "../../store/types/postStoreTypes";

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

async function updatePost(
  post_id: string,
  body: { caption: string },
  token: string
): Promise<IPost | undefined> {
  try {
    const updatedPost = await axios({
      method: "put",
      url: `http://localhost:3001/p/${post_id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      },
      data: JSON.stringify(body)
    });

    return updatedPost.data.data.data;
  } catch (e) {
    console.log(e);
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

async function deleteLikeFromPost(post_id: string, token: string): Promise<void> {
  try {
    const deletedLike = await axios({
      method: "delete",
      url: `http://localhost:3001/p/${post_id}?like_on_post=false`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    console.log(deletedLike.data.data);
  } catch (e) {
    console.log(e);
  }
}

async function deletePost(post_id: string, token: string): Promise<void> {
  try {
    const deletedPost = await axios({
      method: "delete",
      url: `http://localhost:3001/p/${post_id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    console.log(deletedPost.data.data);
  } catch (e) {
    console.log(e);
  }
}

async function deleteImage(post_id: string, img_index: number, token: string): Promise<void> {
  try {
    const deletedImage = await axios({
      method: "delete",
      url: `http://localhost:3001/p/${post_id}?img_index=${img_index}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });
    console.log(deletedImage.data.data);
  } catch (e) {
    console.log(e);
  }
}

export { postPublication, updatePost, addLikeToPost, deleteLikeFromPost, deletePost, deleteImage };
