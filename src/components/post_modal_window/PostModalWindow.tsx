import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostContent from "../post_content/PostContent";
import PostEditModalWindow from "../post_edit_modal_window/PostEditModalWindow";
import { userStore } from "../../store/userStore";
import { postStore, storeOfEditedPost } from "../../store/postStore";
import { getComments, deleteComment } from "../../lib/requests/commentsRequests";
import { deletePost } from "../../lib/requests/postsRequests";
import { IPost } from "../../store/types/postStoreTypes";
import style from "./PostModalWindow.module.css";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const PostModalWindow: React.FC<{ posts: IPost[] }> = array => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const indexOfCurrentPost = postStore(state => state.indexOfCurrentPost);
  const setIndexOfCurrentPost = postStore(state => state.setIndexOfCurrentPost);
  const post = array.posts[indexOfCurrentPost];
  const [indexOfImage, setIndexOfImage] = useState(0);
  const setComments = postStore(state => state.setComments);
  const isOpenedPostMenu = postStore(state => state.isOpenedPostMenu);
  const setIsOpenedPostMenu = postStore(state => state.setIsOpenedPostMenu);
  const deletePostFromStore = postStore(state => state.deletePostFromStore);
  const isOpenedCommentMenu = postStore(state => state.isOpenedCommentMenu);
  const setIsOpenedCommentMenu = postStore(state => state.setIsOpenedCommentMenu);
  const currentComment = postStore(state => state.currentComment);
  const decreaseCommentsNumberAfterDeleting = postStore(
    state => state.decreaseCommentsNumberAfterDeleting
  );
  const deleteCommentFromStore = postStore(state => state.deleteCommentFromStore);
  const deleteSubcommentFromStore = postStore(state => state.deleteSubcommentFromStore);
  const isOpenedPostEditModalWindow = postStore(state => state.isOpenedPostEditModalWindow);
  const setIsOpenedPostEditModalWindow = postStore(state => state.setIsOpenedPostEditModalWindow);
  // передача данных для редактирования поста
  const setPostId = storeOfEditedPost(state => state.setPostId);
  const setImagesOfEditedPost = storeOfEditedPost(state => state.setImagesOfEditedPost);
  const setPostCaption = storeOfEditedPost(state => state.setPostCaption);

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

  async function deleteUserPost() {
    // типизация
    if (token) {
      await deletePost(post.id, token);
      deletePostFromStore(post.id);
    }
  }

  return (
    <div
      className={style.container}
      onClick={e => {
        if (isOpenedCommentMenu || isOpenedPostMenu || isOpenedPostEditModalWindow) {
          e.stopPropagation();
        } else {
          handleModalClose();
        }
      }}
    >
      {isOpenedPostMenu && (
        <div
          className={style.menuContainer}
          onClick={() => {
            setIsOpenedPostMenu(false);
          }}
        >
          <div
            className={style.commentMenu}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {post.user_login === user?.login ? (
              <div>
                <div
                  className={style.redMenuButton}
                  onClick={() => {
                    deleteUserPost();
                    setIsOpenedPostMenu(false);
                    handleModalClose();
                  }}
                >
                  Удалить
                </div>
                <div
                  className={style.menuButton}
                  onClick={() => {
                    setIsOpenedPostMenu(false);
                    setIsOpenedPostEditModalWindow(true);
                    setPostId(post.id);
                    setImagesOfEditedPost(post.images);
                    setPostCaption(post.caption);
                  }}
                >
                  Редактировать
                </div>
                <div
                  className={style.cancelButton}
                  onClick={() => {
                    setIsOpenedPostMenu(false);
                  }}
                >
                  Отмена
                </div>
              </div>
            ) : (
              <div>
                <div className={style.redMenuButton}>Пожаловаться</div>
                <div
                  className={style.cancelButton}
                  onClick={() => {
                    setIsOpenedPostMenu(false);
                  }}
                >
                  Отмена
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isOpenedPostEditModalWindow && <PostEditModalWindow post={post} />}
      {isOpenedCommentMenu && (
        <div
          className={style.menuContainer}
          onClick={() => {
            setIsOpenedCommentMenu(false);
          }}
        >
          <div
            className={style.commentMenu}
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
                className={style.redMenuButton}
                onClick={() => {
                  deleteUserComment();
                  setIsOpenedCommentMenu(false);
                }}
              >
                Удалить
              </div>
            ) : (
              ""
            )}
            <div
              className={style.menuButton}
              onClick={() => {
                setIsOpenedCommentMenu(false);
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
