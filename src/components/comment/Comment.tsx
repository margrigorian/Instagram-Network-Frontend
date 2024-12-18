import React from "react";
import { NavLink } from "react-router-dom";
import { postStore, accountStore } from "../../store/store";
import TextWithLinks from "../post_caption/TextWithLinks";
import { IComment } from "../../lib/types/storeTypes";
import style from "./Comment.module.css";
import * as Icon from "react-bootstrap-icons";

const Comment: React.FC<{ comment: IComment }> = comment => {
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  return (
    <div
      className={style.commentContainer}
      style={!comment.comment.subcomments ? { marginLeft: "45px" } : undefined}
    >
      <div className={style.avatarAndTextContainer}>
        {comment.comment.avatar ? (
          <img src={comment.comment.avatar} className={style.avatarIcon} />
        ) : (
          <Icon.PersonCircle className={style.defaultAvatar} />
        )}
        <div style={!comment.comment.subcomments ? { width: "89%" } : { width: "91%" }}>
          <div className={style.comment}>
            <div className={style.loginAndVerificationIconContainer}>
              <NavLink
                to={`/accounts/${comment.comment.user_login}`}
                onClick={() => {
                  setIsOpenedPostModalWindow(false);
                  // чтобы перезагрузился AccountPage и выполнился request по новому юзеру
                  setReloudAccountPage();
                }}
                className={style.login}
              >
                {comment.comment.user_login}
              </NavLink>
              {comment.comment.verification ? <div className={style.verificationIcon}></div> : ""}
            </div>
            <span className={style.text}>
              <TextWithLinks
                text={comment.comment.content}
                hashtags={comment.comment.hashtags}
                user_links={comment.comment.user_links}
              />{" "}
            </span>
          </div>
          <div className={style.likesAndAnswerContainer}>
            {comment.comment.likes.length > 0 && (
              <div className={style.likesCount}>
                {`"Нравится": ${comment.comment.likes.length}`}
              </div>
            )}
            <div className={style.answerButton}>Ответить</div>
            <Icon.ThreeDots title="Действия с комментарием" className={style.threeDotsIcon} />
          </div>
        </div>
      </div>
      <Icon.Heart className={style.heartIcon} />
    </div>
  );
};

export default Comment;
