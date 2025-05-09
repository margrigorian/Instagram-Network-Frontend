import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import TextWithLinks from "../text_with_links/TextWithLinks";
import Comment from "../comment/Comment";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { postStore } from "../../store/postStore";
import { timePeriodCalculation } from "../../lib/timePeriodCalculation";
import { addComment } from "../../lib/requests/commentsRequests";
import { addLikeToPost, deleteLikeFromPost } from "../../lib/requests/postsRequests";
import { postSubscriptionOnAccount } from "../../lib/requests/accountRequests";
import { IPost } from "../../store/types/postStoreTypes";
import style from "./PostContent.module.css";
import * as Icon from "react-bootstrap-icons";
import EvaluationIconsBlock from "../evaluation_icons_block/EvaluationIconsBlock";

const PostContent: React.FC<{ post: IPost }> = post => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const followings = userStore(state => state.followings);
  const isFollowing = followings.find(el => el.login === post.post.user_login);
  const addFollowing = userStore(state => state.addFollowing);
  const comments = postStore(state => state.comments);
  const addCommentToStore = postStore(state => state.addComment);
  const account = accountStore(state => state.user);
  const increaseFollowersCount = accountStore(state => state.increaseFollowersCount);
  const increaseCommentsNumberAfterAdding = postStore(
    state => state.increaseCommentsNumberAfterAdding
  );
  const deleteLikeFromPostInStore = postStore(state => state.deleteLikeFromPostInStore);
  const setIsOpenedPostMenu = postStore(state => state.setIsOpenedPostMenu);
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

  // БЛОК ДОБАВЛЕНИЯ И УДАЛЕНИЯ ЛАЙКА
  const likes = post.post.likes;
  const user_like = likes.find(el => el === user?.login);
  const addLikeOnPost = postStore(state => state.addLikeOnPost);

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

  async function deleteUserLikeFromPost() {
    if (token) {
      await deleteLikeFromPost(post.post.id, token);
      // типизация
      if (user) {
        deleteLikeFromPostInStore(post.post.id, user.login);
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
          {/* Это должен быть не мой пост и я еще не должна быть подписана на пользователя */}
          {post.post.user_login !== user?.login && !isFollowing && (
            <div className={style.subscriptionContainer}>
              <Icon.Dot className={style.dotIcon} />
              <div
                className={style.subscriptionButton}
                onClick={async () => {
                  // проверка, требуемая типизацией
                  if (token) {
                    await postSubscriptionOnAccount(post.post.user_login, token);
                    addFollowing(post.post.user_login);
                    if (account?.login === post.post.user_login) {
                      // если пост со страницы просматриваемого нами аккаунта
                      increaseFollowersCount();
                    }
                  }
                }}
              >
                Подписаться
              </div>
            </div>
          )}
        </div>
        <Icon.ThreeDots
          style={{ fontSize: "18px" }}
          className={style.threeDotsIcon}
          onClick={() => {
            setIsOpenedPostMenu(true);
          }}
        />
      </div>
      <div>
        <div className={style.captionContainer}>
          {post.post.avatar ? (
            <img src={post.post.avatar} className={style.avatarIcon} />
          ) : (
            <Icon.PersonCircle className={style.defaultAvatar} />
          )}
          {/* свойство display: inline не срабатывает */}
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
            <div key={`commentId-${comment.id}`} style={{ marginBottom: "25px" }}>
              <Comment
                key={`commentId-${comment.id}`}
                post_id={post.post.id}
                comment={comment}
                handleClick={handleClick}
              />
              {comment.subcomments && comment.subcomments?.length > 0 ? (
                <div style={{ marginTop: "25px" }}>
                  {comment.subcomments?.map(subcomment => (
                    <Comment
                      key={`subcommentId-${subcomment.id}`}
                      post_id={post.post.id}
                      comment={subcomment}
                      handleClick={handleClick}
                    />
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={style.evaluationContainer}>
        <EvaluationIconsBlock
          post={post.post}
          user_like={user_like}
          addUserLikeToPost={addUserLikeToPost}
          deleteUserLikeFromPost={deleteUserLikeFromPost}
        />
        <div
          className={style.postDate}
          style={post.post.likes.length === 0 ? { marginTop: "10px" } : {}}
        >
          {timePeriodCalculation(post.post.time, "post")}
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
            // необходимо обнулять
            setUnderComment(null);
          }}
        >
          Опубликовать
        </button>
      </div>
    </div>
  );
};

export default PostContent;
