import React, { useMemo } from "react";
import ImageContainerOfEditedPost from "../ImageContainerOfEditedPost/ImageContainerOfEditedPost";
import NewPostContent from "../new_post_content/NewPostContent";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { storeOfEditedPost } from "../../store/postStore";
import { postPublication } from "../../lib/requests/postsRequests";
import style from "./ModalWindowOfReadyNewPost.module.css";
import * as Icon from "react-bootstrap-icons";

const ModalWindowOfReadyNewPost: React.FC = () => {
  // при записи в input не будет ререндеринга компонента изображений
  // начилие postCaption ниже это вызывает
  const imageContainerForNewPost = useMemo(() => <ImageContainerOfEditedPost />, []);
  const setIsOpenedNewPostModalWindow = storeOfEditedPost(
    state => state.setIsOpenedNewPostModalWindow
  );
  const setIsOpenedModalWindowOfReadyNewPost = storeOfEditedPost(
    state => state.setIsOpenedModalWindowOfReadyNewPost
  );
  // images - для отправки на back
  const token = userStore(state => state.token);
  const files = storeOfEditedPost(state => state.files);
  const postCaption = storeOfEditedPost(state => state.postCaption);
  const setPostCaption = storeOfEditedPost(state => state.setPostCaption);
  const setIndexOfCurrentImage = storeOfEditedPost(state => state.setIndexOfCurrentImage);
  const deleteAllFiles = storeOfEditedPost(state => state.deleteAllFiles);
  // размещение нового поста на фронт
  const user = userStore(state => state.user);
  const account = accountStore(state => state.user);
  const addNewPost = accountStore(state => state.addNewPost);

  async function postPublicationOnAccountPage(): Promise<void> {
    const formData = new FormData();
    files.map(el => {
      if (el instanceof File) {
        formData.append("images", el, el.name);
      }
    });
    formData.append("caption", postCaption);

    if (token) {
      // так как при просмотре аккаунтов без авторизации токен равен null; проверка требуется типизацией
      const publication = await postPublication(formData, token);

      // user?.username === account?.username - в случае, если мы находимся на странице другого пользователя
      // иначе пост добавиться на фронте в массив posts[] аккаунта и отобразиться на чужой странице
      if (publication?.data && user?.login === account?.login) {
        addNewPost(publication.data);
      }
    }

    // закрытие окон
    setIsOpenedNewPostModalWindow(false);
    setIsOpenedModalWindowOfReadyNewPost(false);
    // очистка данных
    setIndexOfCurrentImage(0);
    deleteAllFiles();
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
