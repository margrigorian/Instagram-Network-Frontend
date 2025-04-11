import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import EvaluationIconsBlock from "../evaluation_icons_block/EvaluationIconsBlock";
import { userStore } from "../../store/userStore";
import { postStore } from "../../store/postStore";
import { searchStore } from "../../store/searchStore";
import { IPost } from "../../store/types/postStoreTypes";
import { postDateCalculation } from "../../lib/postDateCalculation";
import {
  addLikeToPostOrFollowAccountFromHomePage,
  deleteLikeFromPostOrUnfollowAccountFromHomePage
} from "../../lib/requests/postsRequests";
import style from "./PostOfHomePage.module.css";
import * as Icon from "react-bootstrap-icons";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

interface IPostProps {
  post: IPost;
  handlePostModalOpen: (postId: string, lengthOfImagesArray: number) => void;
}

const HomePagePost: React.FC<IPostProps> = ({ post, handlePostModalOpen }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const followings = userStore(state => state.followings);
  const isFollowing = followings.find(el => el.login === post.user_login);
  const addFollowing = userStore(state => state.addFollowing);
  const setSearch = searchStore(state => state.setSearch);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const setIsOpenedSearchDrawer = searchStore(state => state.setIsOpenedSearchDrawer);
  const [indexOfImage, setIndexOfImage] = useState(0);

  // БЛОК ДОБАВЛЕНИЯ ЛАЙКА
  const likes = post.likes;
  const user_like = likes.find(el => el === user?.login);
  const addLikeOnPost = postStore(state => state.addLikeOnPost);
  const deleteLikeFromPostInStore = postStore(state => state.deleteLikeFromPostInStore);

  async function addUserLikeToPost(): Promise<void> {
    // проверка, требуемая типизацией
    if (token) {
      await addLikeToPostOrFollowAccountFromHomePage("post_id", post.id, token);
      // типизацией
      if (user) {
        addLikeOnPost(post.id, user.login);
      }
    }
  }

  async function deleteUserLikeFromPost() {
    if (token) {
      await deleteLikeFromPostOrUnfollowAccountFromHomePage("post_id", post.id, token);
      // типизация
      if (user) {
        deleteLikeFromPostInStore(post.id, user.login);
      }
    }
  }

  return (
    <div>
      {/* ЗАГАЛОВОК ПОСТА */}
      <div className={style.postHeaderContainer}>
        <div className={style.postHeaderInfo}>
          <NavLink
            to={`/accounts/${post.user_login}`}
            onClick={() => {
              // чтобы перезагрузилась страница и выполнился request по новому юзеру
              // setReloudAccountPage();
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            }}
          >
            {post.avatar ? (
              <img src={post.avatar} className={style.avatarIcon} />
            ) : (
              <Icon.PersonCircle className={style.defaultAvatar} />
            )}
          </NavLink>
          <NavLink
            to={`/accounts/${post.user_login}`}
            onClick={() => {
              // чтобы перезагрузилась страница и выполнился request по новому юзеру
              // setReloudAccountPage();
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            }}
            className={style.login}
          >
            {post.user_login}
          </NavLink>
          {post.verification ? <div className={style.verificationIcon}></div> : ""}
          <Icon.Dot className={style.dotIcon} />
          <div className={style.postDate}>{postDateCalculation(post.time, "post")}</div>
          {/* Не отображается, так как нет модального меню поста с кнопкой отписки */}
          {post.user_login !== user?.login && !isFollowing && (
            <div className={style.subscriptionContainer}>
              <Icon.Dot className={style.dotIcon} />
              <div
                className={style.subscriptionButton}
                onClick={async () => {
                  if (token) {
                    await addLikeToPostOrFollowAccountFromHomePage(
                      "login_of_following",
                      post.user_login,
                      token
                    );
                    addFollowing(post.user_login);
                  }
                }}
              >
                Подписаться
              </div>
            </div>
          )}
        </div>
        <Icon.ThreeDots style={{ fontSize: "18px" }} className={style.threeDotsIcon} />
      </div>
      {/* ИЗОБРАЖЕНИЯ ПОСТА */}
      <div
        style={{
          backgroundImage: `url(${post.images[indexOfImage].image})`
        }}
        className={style.imageContainer}
      >
        {indexOfImage !== 0 ? (
          <KeyboardArrowLeftOutlinedIcon
            className={style.imageArrow}
            onClick={() => setIndexOfImage(indexOfImage - 1)}
          />
        ) : (
          <div></div>
        )}
        {indexOfImage < post.images.length - 1 ? (
          <KeyboardArrowRightOutlinedIcon
            className={style.imageArrow}
            onClick={() => setIndexOfImage(indexOfImage + 1)}
          />
        ) : (
          <div></div>
        )}
      </div>
      {/* ОЦЕНКА ПОСТА */}
      <div style={{ marginTop: "13px" }}>
        <EvaluationIconsBlock
          post={post}
          user_like={user_like}
          addUserLikeToPost={addUserLikeToPost}
          deleteUserLikeFromPost={deleteUserLikeFromPost}
          handlePostModalOpen={handlePostModalOpen}
        />
      </div>

      {post.comments_number ? (
        <div
          className={style.linkToViewComments}
          onClick={() => handlePostModalOpen(post.id, post.images.length)}
        >{`Посмотреть все комментарии (${post.comments_number})`}</div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HomePagePost;
