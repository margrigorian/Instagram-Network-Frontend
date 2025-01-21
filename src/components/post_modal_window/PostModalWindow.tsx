import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountStore, postStore, userStore } from "../../store/store";
import { IPost } from "../../lib/types/storeTypes";
import { deleteComment, getComments } from "../../lib/requests/commentsRequests";
import PostContent from "../post_content/PostContent";
import style from "./PostModalWindow.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const PostModalWindow: React.FC<{ posts: IPost[] }> = array => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const indexOfCurrentPost = postStore(state => state.indexOfCurrentPost);
  const setIndexOfCurrentPost = postStore(state => state.setIndexOfCurrentPost);
  const post = array.posts[indexOfCurrentPost];
  const [indexOfImage, setIndexOfImage] = useState(0);
  const setComments = postStore(state => state.setComments);
  const isActiveCommentMenu = postStore(state => state.isActiveCommentMenu);
  const setIsActiveCommentMenu = postStore(state => state.setIsActiveCommentMenu);
  const currentComment = postStore(state => state.currentComment);
  const decreaseCommentsNumberAfterDeleting = accountStore(
    state => state.decreaseCommentsNumberAfterDeleting
  );
  const deleteCommentFromStore = postStore(state => state.deleteCommentFromStore);
  const deleteSubcommentFromStore = postStore(state => state.deleteSubcommentFromStore);

  useEffect(() => {
    makeRequest(post.id);
  }, []);

  async function makeRequest(id: string): Promise<void> {
    const comments = await getComments(id);
    if (comments?.data) {
      setComments(comments.data);
    }
  }

  const updatingTheURLAfterAPostOrImageChange = (
    postId: string,
    lengthOfImagesArray: number,
    imgIndex: number
  ) => {
    const postUrl =
      lengthOfImagesArray > 1 ? `/p/${postId}/?img_index=${imgIndex}` : `/p/${postId}/`;
    window.history.replaceState({}, "", postUrl);
  };

  // возвращение к основному url при закрытии модального окна
  const navigate = useNavigate();
  function handleModalClose() {
    navigate(-1);
    setIsOpenedPostModalWindow(false);
  }

  // для кнопки назад браузера
  window.onpopstate = () => {
    setIsOpenedPostModalWindow(false);
  };

  async function deleteUserComment() {
    // проверка, требуемая типизацией
    if (currentComment && token) {
      await deleteComment(post.id, currentComment.comment_id, token);
      if (currentComment.under_comment === null) {
        deleteCommentFromStore(currentComment.comment_id);
      } else {
        deleteSubcommentFromStore(currentComment.comment_id, currentComment.under_comment);
      }
      // уменьшение на: количество подкомментариев + сам комментарий
      decreaseCommentsNumberAfterDeleting(post.id, currentComment.number_of_subcomments + 1);
    }
  }

  return (
    <div
      className={style.container}
      onClick={e => {
        if (isActiveCommentMenu) {
          e.stopPropagation();
        } else {
          handleModalClose();
        }
      }}
    >
      {isActiveCommentMenu && (
        <div
          className={style.commentMenueContainer}
          onClick={() => {
            setIsActiveCommentMenu(false);
          }}
        >
          <div
            className={style.commentMenue}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {/* если свой комментарий, кнопки "пожаловаться" не будет  */}
            {currentComment?.user_login !== user?.login && (
              <div className={style.redButton}>Пожаловаться</div>
            )}
            {/* мой комментарий или же мой пост */}
            {currentComment?.user_login === user?.login || post.user_login === user?.login ? (
              <div
                className={style.redButton}
                onClick={() => {
                  deleteUserComment();
                  setIsActiveCommentMenu(false);
                }}
              >
                Удалить
              </div>
            ) : (
              ""
            )}
            <div
              className={style.cancelButton}
              onClick={() => {
                setIsActiveCommentMenu(false);
              }}
            >
              Отмена
            </div>
          </div>
        </div>
      )}
      {indexOfCurrentPost > 0 ? (
        <KeyboardArrowLeftOutlinedIcon
          className={style.postArrow}
          sx={{ fontSize: "32px", marginLeft: "20px" }}
          onClick={e => {
            e.stopPropagation();
            setIndexOfCurrentPost(indexOfCurrentPost - 1);
            // чтобы каждый пост отображался с первой фотографии
            setIndexOfImage(0);
            // через изменения в store обновить url не получится,
            // ререндеринг страницы происходит после выполения всех функций
            // поэтому:
            updatingTheURLAfterAPostOrImageChange(
              array.posts[indexOfCurrentPost - 1].id,
              array.posts[indexOfCurrentPost - 1].images.length,
              1
            );
            makeRequest(array.posts[indexOfCurrentPost - 1].id);
          }}
        />
      ) : (
        <div style={{ width: "52px" }}></div>
      )}
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <div
          style={{
            backgroundImage: `url(${post.images[indexOfImage].image})`
          }}
          className={style.imageContainer}
        >
          {indexOfImage !== 0 ? (
            <KeyboardArrowLeftOutlinedIcon
              className={style.imageArrow}
              onClick={() => {
                setIndexOfImage(indexOfImage - 1);
                // пост текущий, а изображения сменяюстя
                updatingTheURLAfterAPostOrImageChange(
                  post.id,
                  post.images.length,
                  post.images[indexOfImage].img_index - 1
                );
              }}
            />
          ) : (
            <div></div>
          )}
          {indexOfImage < post.images.length - 1 ? (
            <KeyboardArrowRightOutlinedIcon
              className={style.imageArrow}
              onClick={() => {
                setIndexOfImage(indexOfImage + 1);
                // пост текущий, а изображения сменяюстя
                updatingTheURLAfterAPostOrImageChange(
                  post.id,
                  post.images.length,
                  post.images[indexOfImage].img_index + 1
                );
              }}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className={style.postInfo}>
          <PostContent post={post} />
        </div>
      </div>
      <div className={style.closeAndArrowIconsContainer}>
        <CloseOutlinedIcon className={style.closeIcon} sx={{ fontSize: "28px" }} />
        {indexOfCurrentPost < array.posts.length - 1 ? (
          <KeyboardArrowRightOutlinedIcon
            className={style.postArrow}
            sx={{ fontSize: "32px" }}
            onClick={e => {
              e.stopPropagation();
              setIndexOfCurrentPost(indexOfCurrentPost + 1);
              // чтобы каждый пост отображался с первой фотографии
              setIndexOfImage(0);
              // через изменения в store обновить url не получится,
              // ререндеринг страницы происходит после выполения всех функций
              // поэтому:
              updatingTheURLAfterAPostOrImageChange(
                array.posts[indexOfCurrentPost + 1].id,
                array.posts[indexOfCurrentPost + 1].images.length,
                1
              );
              makeRequest(array.posts[indexOfCurrentPost + 1].id);
            }}
          />
        ) : (
          <div style={{ width: "32px" }}></div>
        )}
        <div style={{ height: "28px" }}></div>
      </div>
    </div>
  );
};

export default PostModalWindow;
