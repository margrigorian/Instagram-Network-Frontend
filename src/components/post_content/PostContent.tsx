import React from "react";
import { NavLink } from "react-router-dom";
import { userStore, postStore, accountStore } from "../../store/store";
import TextWithLinks from "../post_caption/TextWithLinks";
import Comment from "../comment/Comment";
import { postDateCalculation } from "../../lib/postDateCalculation";
import { IPost } from "../../lib/types/storeTypes";
import style from "./PostContent.module.css";
import * as Icon from "react-bootstrap-icons";

const PostContent: React.FC<{ post: IPost }> = post => {
  const user = userStore(state => state.user);
  const following = userStore(state => state.following);
  const isFollowing = following.find(el => el.login === user?.login);
  const comments = postStore(state => state.comments);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.userContainer}>
          {post.post.avatar ? (
            <img src={post.post.avatar} className={style.avatarIcon} />
          ) : (
            <Icon.PersonCircle className={style.defaultAvatar} />
          )}
          <NavLink
            to={`/accounts/${post.post.user_login}`}
            onClick={() => {
              // чтобы перезагрузилась страница и выполнился request по новому юзеру
              setReloudAccountPage();
              setIsOpenedPostModalWindow(false);
            }}
            className={style.login}
          >
            {post.post.user_login}
          </NavLink>
          {post.post.verification ? <div className={style.verificationIcon}></div> : ""}
          {/* Это должен быть не мой пост и я еще не должны быть подписана на пользователя */}
          {post.post.user_login !== user?.login && !isFollowing && (
            <div className={style.subscriptionContainer}>
              <Icon.Dot className={style.dotIcon} />
              <div className={style.subscriptionButton}>Подписаться</div>
            </div>
          )}
        </div>
        <Icon.ThreeDots style={{ fontSize: "18px" }} className={style.threeDotsIcon} />
      </div>
      <div>
        <div className={style.captionContainer}>
          {post.post.avatar ? (
            <img src={post.post.avatar} className={style.avatarIcon} />
          ) : (
            <Icon.PersonCircle className={style.defaultAvatar} />
          )}
          <div className={style.caption}>
            <div className={style.loginAndVerificationIconContainer}>
              <NavLink
                to={`/accounts/${post.post.user_login}`}
                onClick={() => {
                  // чтобы перезагрузилась страница и выполнился request по новому юзеру
                  setReloudAccountPage();
                  setIsOpenedPostModalWindow(false);
                }}
                className={style.login}
              >
                {post.post.user_login}
              </NavLink>
              {post.post.verification ? <div className={style.verificationIcon}></div> : ""}
            </div>
            <span className={style.captionText}>
              <TextWithLinks
                text={post.post.caption}
                hashtags={post.post.hashtags}
                user_links={post.post.user_links}
              />{" "}
            </span>
          </div>
        </div>
        <div className={style.commentsContainer}>
          {comments.map(comment => (
            <div key={`commentId-${comment.id}`}>
              <Comment comment={comment} key={`commentId-${comment.id}`} />
              <div style={{ marginTop: "30px" }}>
                {comment.subcomments.map(subcomment => (
                  <Comment comment={subcomment} key={`subcommentId-${subcomment.id}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className={style.evaluationContainer}>
          <div className={style.iconsContainer}>
            <div className={style.evaluationIconsContainer}>
              <Icon.Heart className={style.evaluationIcon} />
              <Icon.Chat className={style.evaluationIcon} />
              <Icon.Send className={style.evaluationIcon} />
            </div>
            <Icon.Bookmark className={style.evaluationIcon} />
          </div>
          {post.post.likes.length > 0 && (
            <div>
              <div className={style.likesCount}>
                <div>
                  Нравится{" "}
                  <NavLink
                    to={`/accounts/${post.post.likes[0]}`}
                    onClick={() => {
                      // чтобы перезагрузилась страница и выполнился request по новому юзеру
                      setReloudAccountPage();
                      setIsOpenedPostModalWindow(false);
                    }}
                    className={style.login}
                  >
                    {post.post.likes[0]}
                  </NavLink>
                </div>
                {post.post.likes.length > 1 ? (
                  <div>
                    &nbsp;и <span style={{ fontWeight: "500" }}>{post.post.likes.length - 1}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
          <div
            className={style.postDate}
            style={post.post.likes.length === 0 ? { marginTop: "10px" } : {}}
          >
            {postDateCalculation(post.post.time)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
