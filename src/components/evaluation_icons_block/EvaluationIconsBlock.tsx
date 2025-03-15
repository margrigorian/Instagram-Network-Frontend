import React from "react";
import { NavLink } from "react-router-dom";
import { postStore } from "../../store/postStore";
import { IPost } from "../../store/types/postStoreTypes";
import style from "./EvaluationIconsBlock.module.css";
import * as Icon from "react-bootstrap-icons";
import { accountStore } from "../../store/accountStore";

interface IPostProps {
  post: IPost;
  user_like: string | undefined;
  addUserLikeToPost: () => void;
  deleteUserLikeFromPost: () => void;
  handlePostModalOpen?: (postId: string, lengthOfImagesArray: number) => void | null;
}

const EvaluationIconsBlock: React.FC<IPostProps> = ({
  post,
  user_like,
  addUserLikeToPost,
  deleteUserLikeFromPost,
  handlePostModalOpen = null
}) => {
  const isOpenedPostModalWindow = postStore(state => state.isOpenedPostModalWindow);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  return (
    <div className={style.evaluationContainer}>
      <div
        className={style.iconsContainer}
        style={!user_like ? { marginBottom: "10px" } : undefined}
      >
        <div className={style.evaluationIconsContainer}>
          {user_like ? (
            <Icon.HeartFill
              className={style.evaluationIcon}
              style={{ color: "red" }}
              onClick={() => {
                deleteUserLikeFromPost();
              }}
            />
          ) : (
            <Icon.Heart
              className={style.evaluationIcon}
              onClick={() => {
                addUserLikeToPost();
              }}
            />
          )}
          <Icon.Chat
            className={style.evaluationIcon}
            onClick={() => {
              if (handlePostModalOpen) handlePostModalOpen(post.id, post.images.length);
            }}
          />
          <Icon.Send className={style.evaluationIcon} />
        </div>
        <Icon.Bookmark className={style.evaluationIcon} />
      </div>
      {post.likes.length > 0 && (
        <div>
          <div className={style.likesCount}>
            <div>
              Нравится{" "}
              <NavLink
                to={`/accounts/${post.likes[0]}`}
                onClick={() => {
                  // чтобы перезагрузилась страница и выполнился request по новому юзеру
                  setReloudAccountPage();
                  if (isOpenedPostModalWindow) {
                    setIsOpenedPostModalWindow(false);
                  }
                }}
                className={style.login}
              >
                {post.likes[0]}
              </NavLink>
            </div>
            {post.likes.length > 1 ? (
              <div>
                &nbsp;и <span style={{ fontWeight: "500" }}>{post.likes.length - 1}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationIconsBlock;
