import axios from "axios";
import { IComment } from "../../store/types/postStoreTypes";
import { ICommentBody } from "./types/bodyTypesRequested";

interface IResponse<T> {
  data: T | null;
  error: Message | null;
}

type Message = {
  message: string;
};

async function getComments(post_id: string): Promise<IResponse<IComment[]> | undefined> {
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

async function addComment(
  post_id: string,
  body: ICommentBody,
  token: string
): Promise<IResponse<IComment> | undefined> {
  try {
    const comment = await axios({
      method: "post",
      url: `http://localhost:3001/p/${post_id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      },
      data: JSON.stringify(body)
    });

    return comment.data.data;
  } catch (e) {
    console.log(e);
  }
}

async function addLikeToComment(post_id: string, comment_id: number, token: string): Promise<void> {
  try {
    const like = await axios({
      method: "post",
      url: `http://localhost:3001/p/${post_id}?comment_id=${comment_id}`,
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

async function deleteComment(post_id: string, comment_id: number, token: string): Promise<void> {
  try {
    const deletedComment = await axios({
      method: "delete",
      url: `http://localhost:3001/p/${post_id}?comment_id=${comment_id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        authorization: `Bearer ${token}`
      }
    });

    console.log(deletedComment.data.data);
  } catch (e) {
    console.log(e);
  }
}

async function deleteLikeFromComment(
  post_id: string,
  comment_id: number,
  token: string
): Promise<void> {
  try {
    const deletedLike = await axios({
      method: "delete",
      url: `http://localhost:3001/p/${post_id}?liked_comment_id=${comment_id}`,
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

export { getComments, addComment, addLikeToComment, deleteComment, deleteLikeFromComment };
