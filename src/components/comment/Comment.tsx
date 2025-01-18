import React from "react";
import { NavLink } from "react-router-dom";
import { postStore, accountStore, userStore } from "../../store/store";
import TextWithLinks from "../post_caption/TextWithLinks";
import { IComment } from "../../lib/types/storeTypes";
import { addLikeToComment } from "../../lib/requests/commentRequest";
import style from "./Comment.module.css";
import * as Icon from "react-bootstrap-icons";

interface ICommentProps {
  post_id: string;
  comment: IComment;
  handleClick: (commentId: number, login: string) => void;
}

const Comment: React.FC<ICommentProps> = ({ post_id, comment, handleClick }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const likes = comment.likes;
  // console.log(likes);

  const user_like = likes.find(el => el === user?.login);
  const addLikeOnComment = postStore(state => state.addLikeOnComment);
  const addLikeOnSubcomment = postStore(state => state.addLikeOnSubcomment);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  async function addUserLikeToComment(comment_id: number): Promise<void> {
    // проверка, требуемая типизацией
    if (token) {
      await addLikeToComment(post_id, comment_id, token);
      // типизация
      if (user) {
        // добавление информации в store
        if (comment.under_comment === null) {
          addLikeOnComment(comment_id, user.login);
        } else {
          addLikeOnSubcomment(comment.under_comment, comment_id, user.login);
        }
      }
    }
  }

  return (
    <div
      className={style.commentContainer}
      style={!comment.subcomments ? { marginLeft: "45px" } : undefined}
    >
      <div className={style.avatarAndTextContainer}>
        {comment.avatar ? (
          <img src={comment.avatar} className={style.avatarIcon} />
        ) : (
          <Icon.PersonCircle className={style.defaultAvatar} />
        )}
        <div style={!comment.subcomments ? { width: "89%" } : { width: "91%" }}>
          <div className={style.comment}>
            <div className={style.loginAndVerificationIconContainer}>
              <NavLink
                to={`/accounts/${comment.user_login}`}
                onClick={() => {
                  setIsOpenedPostModalWindow(false);
                  // чтобы перезагрузился AccountPage и выполнился request по новому юзеру
                  setReloudAccountPage();
                }}
                className={style.login}
              >
                {comment.user_login}
              </NavLink>
              {comment.verification ? <div className={style.verificationIcon}></div> : ""}
            </div>
            <span className={style.text}>
              <TextWithLinks
                text={comment.content}
                hashtags={comment.hashtags}
                user_links={comment.user_links}
              />{" "}
            </span>
          </div>
          {user && (
            <div className={style.likesAndAnswerContainer}>
              {comment.likes.length > 0 && (
                <div className={style.likesCount}>{`Нравится: ${comment.likes.length}`}</div>
              )}

              <div
                className={style.answerButton}
                onClick={() => {
                  if (comment.under_comment) {
                    // если это подкомментарий, передай id основного через under_comment
                    handleClick(comment.under_comment, comment.user_login);
                  } else {
                    handleClick(comment.id, comment.user_login);
                  }
                }}
              >
                Ответить
              </div>
              <Icon.ThreeDots title="Действия с комментарием" className={style.threeDotsIcon} />
            </div>
          )}
        </div>
      </div>
      {user_like ? (
        <Icon.HeartFill className={style.heartIcon} style={{ color: "red" }} />
      ) : (
        <Icon.Heart
          className={style.heartIcon}
          onClick={() => {
            addUserLikeToComment(comment.id);
          }}
        />
      )}
    </div>
  );
};

export default Comment;
