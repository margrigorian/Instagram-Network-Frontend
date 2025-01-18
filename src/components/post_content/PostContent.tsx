import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { userStore, postStore, accountStore } from "../../store/store";
import TextWithLinks from "../post_caption/TextWithLinks";
import Comment from "../comment/Comment";
import { postDateCalculation } from "../../lib/postDateCalculation";
import { IPost } from "../../lib/types/storeTypes";
import style from "./PostContent.module.css";
import * as Icon from "react-bootstrap-icons";
import { addComment } from "../../lib/requests/commentRequest";
import { addLikeToPost } from "../../lib/requests/postsRequests";

const PostContent: React.FC<{ post: IPost }> = post => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const following = userStore(state => state.following);
  const isFollowing = following.find(el => el.login === user?.login);
  const comments = postStore(state => state.comments);
  const addCommentToStore = postStore(state => state.addComment);
  const increaseCommentsNumberAfterAdding = accountStore(
    state => state.increaseCommentsNumberAfterAdding
  );
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  // БЛОК ДОБАВЛЕНИЯ КОММЕНТАРИЯ
  const [text, setText] = useState("");
  const [underComment, setUnderComment] = useState<number | null>(null);
  // для фокуса на элемент textarea при клике на "ответить" в комментариях
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function handleClick(commentId: number, login: string): void {
    // с передачей id главного комментария, под которыми хотим оставить свой
    setUnderComment(commentId);
    // и логина пользователя для обращения
    if (textareaRef.current) {
      setText(`@${login} `);
      textareaRef.current.focus();
    }
  }

  async function addCommentToPost(): Promise<void> {
    // проверка, требуемая типизацией
    if (user && token) {
      const data = {
        content: text,
        under_comment: underComment
      };
      const comment = await addComment(post.post.id, data, token);
      // проверка, требуемая типизацией
      if (comment?.data) {
        addCommentToStore(comment.data);
        increaseCommentsNumberAfterAdding(post.post.id);
      }

      setText("");
    }
  }

  // БЛОК ДОБАВЛЕНИЯ ЛАЙКА
  const likes = post.post.likes;
  const user_like = likes.find(el => el === user?.login);
  const addLikeOnPost = accountStore(state => state.addLikeOnPost);

  async function addUserLikeToPost(): Promise<void> {
    // проверка, требуемая типизацией
    if (token) {
      await addLikeToPost(post.post.id, token);
      // типизацией
      if (user) {
        addLikeOnPost(post.post.id, user.login);
      }
    }
  }

  return (
    <div>
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
              <Comment
                key={`commentId-${comment.id}`}
                post_id={post.post.id}
                comment={comment}
                handleClick={handleClick}
              />
              <div style={{ marginTop: "30px" }}>
                {comment.subcomments?.map(subcomment => (
                  <Comment
                    key={`subcommentId-${subcomment.id}`}
                    post_id={post.post.id}
                    comment={subcomment}
                    handleClick={handleClick}
                  />
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
              {user_like ? (
                <Icon.HeartFill className={style.evaluationIcon} style={{ color: "red" }} />
              ) : (
                <Icon.Heart
                  className={style.evaluationIcon}
                  onClick={() => {
                    addUserLikeToPost();
                  }}
                />
              )}
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
      <div className={style.commentTextAreaContainer}>
        <Icon.EmojiSmile style={{ fontSize: "23px" }} />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          className={style.commentTextArea}
          disabled={user ? false : true}
          placeholder="Добавьте комментарий..."
        />
        <button
          disabled={text ? false : true}
          className={style.addCommentButton}
          style={text ? { color: "#2196f3" } : { color: "#c9e5fc" }}
          onClick={() => {
            addCommentToPost();
          }}
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
};

export default PostContent;
