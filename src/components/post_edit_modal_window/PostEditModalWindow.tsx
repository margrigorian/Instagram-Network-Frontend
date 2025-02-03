import React, { useMemo } from "react";
import ImageContainerOfEditedPost from "../ImageContainerOfEditedPost/ImageContainerOfEditedPost";
import NewPostContent from "../new_post_content/NewPostContent";
import { userStore, accountStore, postStore, storeOfEditedPost } from "../../store/store";
import { updatePost } from "../../lib/requests/postsRequests";
import { IPost } from "../../lib/types/storeTypes";
import style from "./PostEditModalWindow.module.css";

const PostEditModalWindow: React.FC<{ post: IPost }> = ({ post }) => {
  const token = userStore(state => state.token);
  // при записи в input не будет ререндеринга компонента изображений
  // начилие postCaption ниже это вызывает
  const imageContainerForNewPost = useMemo(() => <ImageContainerOfEditedPost />, []);
  const setIsOpenedPostEditModalWindow = postStore(state => state.setIsOpenedPostEditModalWindow);
  const setImagesOfEditedPost = storeOfEditedPost(state => state.setImagesOfEditedPost);
  const setIndexOfCurrentImage = storeOfEditedPost(state => state.setIndexOfCurrentImage);
  const postCaption = storeOfEditedPost(state => state.postCaption);
  const setPostCaption = storeOfEditedPost(state => state.setPostCaption);
  const updatePostInStore = accountStore(state => state.updatePostInStore);

  async function updateUserPost() {
    // проверка, требуемая типизацией
    if (token) {
      const updatedPost = await updatePost(post.id, { caption: postCaption }, token);
      if (updatedPost) {
        // в accountStore
        updatePostInStore(
          post.id,
          updatedPost.caption,
          updatedPost.hashtags,
          updatedPost.user_links
        );
      }
    }
  }

  return (
    <div
      className={style.container}
      onClick={() => {
        setIsOpenedPostEditModalWindow(false);
        setImagesOfEditedPost([]);
        setPostCaption("");
        setIndexOfCurrentImage(0);
      }}
    >
      <div
        className={style.modalWindow}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className={style.modalHeader}>
          <div
            className={style.cancelButton}
            onClick={() => {
              setIsOpenedPostEditModalWindow(false);
              setImagesOfEditedPost([]);
              setPostCaption("");
              setIndexOfCurrentImage(0);
            }}
          >
            Отмена
          </div>
          <div className={style.caption}>Редактирование информации</div>
          <div
            className={style.doneButton}
            onClick={async () => {
              // произошли ли измнения в подписи поста
              if (postCaption !== post.caption) {
                await updateUserPost();
              }
              setIsOpenedPostEditModalWindow(false);
              setImagesOfEditedPost([]);
              setPostCaption("");
              setIndexOfCurrentImage(0);
            }}
          >
            Готово
          </div>
        </div>
        <div className={style.modalContent}>
          {imageContainerForNewPost}
          <NewPostContent />
        </div>
      </div>
    </div>
  );
};

export default PostEditModalWindow;
