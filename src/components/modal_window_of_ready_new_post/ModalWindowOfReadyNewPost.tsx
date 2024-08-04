import React, { useMemo } from "react";
import { newPostStore, userStore, accountStore } from "../../store/store";
import ImageContainerForNewPost from "../image_container_for_new_post/ImageContainerForNewPost";
import NewPostContent from "../new_post_content/NewPostContent";
import { postPublication } from "../../lib/request";
import style from "./ModalWindowOfReadyNewPost.module.css";
import * as Icon from "react-bootstrap-icons";

const ModalWindowOfReadyNewPost: React.FC = () => {
  // при записи в input не будет ререндеринга компонента изображений
  // начилие postCaption ниже то вызывает
  const imageContainerForNewPost = useMemo(() => <ImageContainerForNewPost />, []);
  const setIsOpenedNewPostModalWindow = newPostStore(state => state.setIsOpenedNewPostModalWindow);
  const setIsOpenedModalWindowOfReadyNewPost = newPostStore(
    state => state.setIsOpenedModalWindowOfReadyNewPost
  );
  // images - для отправки на back
  const token = userStore(state => state.token);
  const images = newPostStore(state => state.images);
  const postCaption = newPostStore(state => state.postCaption);
  const setPostCaption = newPostStore(state => state.setPostCaption);
  const setIndexOfCurrentImage = newPostStore(state => state.setIndexOfCurrentImage);
  const deleteAllImages = newPostStore(state => state.deleteAllImages);
  const addNewPost = accountStore(state => state.addNewPost);

  async function postPublicationOnAccountPage(): Promise<void> {
    const formData = new FormData();
    images.map(el => {
      formData.append("images", el, el.name);
    });
    formData.append("caption", postCaption);

    if (token) {
      // так как при просмотре аккаунтов без авторизации токен равен null; проверка требуется типизацией
      const publication = await postPublication(formData, token);

      if (publication?.data) {
        addNewPost(publication.data);
      }
    }

    // закрытие окон
    setIsOpenedNewPostModalWindow(false);
    setIsOpenedModalWindowOfReadyNewPost(false);
    // очистка данных
    setIndexOfCurrentImage(0);
    deleteAllImages();
    setPostCaption("");
  }

  return (
    <div
      className={style.container}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <div className={style.modalHeader}>
        <Icon.ArrowLeft
          size={"25px"}
          cursor={"pointer"}
          onClick={() => {
            setIsOpenedModalWindowOfReadyNewPost(false);
            setIndexOfCurrentImage(0);
            setPostCaption("");
          }}
        />
        <div>Создание публикации</div>
        <div
          className={style.shareButton}
          onClick={() => {
            postPublicationOnAccountPage();
          }}
        >
          Поделиться
        </div>
      </div>
      <div className={style.modalContent}>
        {imageContainerForNewPost}
        <NewPostContent />
      </div>
    </div>
  );
};

export default ModalWindowOfReadyNewPost;
