import React from "react";
import { userStore } from "../../store/userStore";
import { storeOfEditedPost } from "../../store/postStore";
import style from "./NewPostContent.module.css";
import * as Icon from "react-bootstrap-icons";

const NewPostContent: React.FC = () => {
  const user = userStore(state => state.user);
  const postCaption = storeOfEditedPost(state => state.postCaption);
  const setPostCaption = storeOfEditedPost(state => state.setPostCaption);

  return (
    <div className={style.postContent}>
      <div className={style.userInfo}>
        {user?.avatar ? (
          <img src={user.avatar} className={style.avatarIcon} />
        ) : (
          <Icon.PersonCircle className={style.defaultAvatar} />
        )}
        <div style={{ fontSize: "14px", fontWeight: "500" }}>{user?.login}</div>
      </div>
      <textarea
        placeholder="Добавить подпись"
        maxLength={2200}
        className={style.postCaption}
        value={postCaption}
        onChange={e => setPostCaption(e.target.value)}
      ></textarea>
    </div>
  );
};

export default NewPostContent;
