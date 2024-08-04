import React, { useRef, useState } from "react";
import { newPostStore } from "../../store/store";
import ImageContainerForNewPost from "../image_container_for_new_post/ImageContainerForNewPost";
import ModalWindowOfReadyNewPost from "../modal_window_of_ready_new_post/ModalWindowOfReadyNewPost";
import style from "./NewPostModalWindow.module.css";
import * as Icon from "react-bootstrap-icons";

const NewPostModalWindow: React.FC = () => {
  const setIsOpenedNewPostModalWindow = newPostStore(state => state.setIsOpenedNewPostModalWindow);
  const isOpenedModalWindowOfReadyNewPost = newPostStore(
    state => state.isOpenedModalWindowOfReadyNewPost
  );
  const setIsOpenedModalWindowOfReadyNewPost = newPostStore(
    state => state.setIsOpenedModalWindowOfReadyNewPost
  );
  const [modalWindowForDeletingThePublication, setModalWindowForDeletingThePublication] =
    useState(false);
  const images = newPostStore(state => state.images);
  const setImages = newPostStore(state => state.setImages);
  const isOpenedCollectionOfImagesWindow = newPostStore(
    state => state.isOpenedCollectionOfImagesWindow
  );
  const setIsOpenedCollectionOfImagesWindow = newPostStore(
    state => state.setIsOpenedCollectionOfImagesWindow
  );
  const deleteAllImages = newPostStore(state => state.deleteAllImages);
  const setIndexOfCurrentImage = newPostStore(state => state.setIndexOfCurrentImage);
  const setPostCaption = newPostStore(state => state.setPostCaption);

  const imagePicker = useRef(null);

  return (
    <div
      onClick={() => {
        if (images.length > 0) {
          setModalWindowForDeletingThePublication(true);
        } else {
          setIsOpenedNewPostModalWindow(false);
        }
      }}
      className={style.modalContainer}
      style={
        !modalWindowForDeletingThePublication
          ? { backgroundColor: "rgba(40, 40, 40, 0.8)" }
          : undefined
      }
    >
      {modalWindowForDeletingThePublication ? (
        // при удалении публикации
        <div
          className={style.alertModalContainer}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className={style.alertModalWindow}>
            <div className={style.alertModalWindowText}>Удалить публикацию?</div>
            <div
              className={`${style.alertModalWindowText} ${style.textBorder}`}
              onClick={() => {
                // закрытие Alert Modal Window
                setModalWindowForDeletingThePublication(false);
                // закрытие основных модальных окон
                setIsOpenedNewPostModalWindow(false);
                setIsOpenedModalWindowOfReadyNewPost(false);
                // удаление всех загруженных фото
                deleteAllImages();
                // удаление подписи
                setPostCaption("");
              }}
            >
              Удалить
            </div>
            <div
              className={style.alertModalWindowText}
              style={{ color: "#2196f3", cursor: "pointer" }}
              onClick={() => {
                setModalWindowForDeletingThePublication(false);
              }}
            >
              Отмена
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {!isOpenedModalWindowOfReadyNewPost ? (
        <div
          className={style.modal}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {images.length === 0 ? (
            <div style={{ height: "100%" }}>
              <div className={style.titleTexOfThePostCreation}>Создание публикации</div>
              <div className={style.modalWindowContent}>
                <div className={style.cameraIcon}></div>
                <div className={style.imageLoadingText}>Перетащите сюда фото и видео</div>
                <input
                  type="file"
                  accept="image/*,.png,.jpeg,.jpg"
                  className={style.hiddenImageInput}
                  ref={imagePicker}
                  onChange={evt => {
                    const inputsFile = evt.target as HTMLInputElement;
                    // проверка для исключения ошибки
                    if (inputsFile.files && inputsFile.files[0]) {
                      setImages(inputsFile.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    // через ref сработает клик на image input
                    if (imagePicker.current) {
                      // не null
                      (imagePicker.current as HTMLInputElement).click();
                    }
                  }}
                  className={style.uploadButton}
                >
                  Выбрать на компьютере
                </button>
              </div>
            </div>
          ) : (
            <div style={{ height: "100%" }}>
              <div className={style.headerOfModalWindow}>
                <Icon.ArrowLeft
                  size={"25px"}
                  cursor={"pointer"}
                  onClick={() => {
                    deleteAllImages();
                    setIndexOfCurrentImage(0);
                  }}
                />
                <div>Обрезать</div>
                <div
                  className={style.nextButton}
                  onClick={() => {
                    // закрытие компонента коллекции изображений
                    if (isOpenedCollectionOfImagesWindow) {
                      setIsOpenedCollectionOfImagesWindow(false);
                    }
                    // открытие компонента Ready New Post
                    setIsOpenedModalWindowOfReadyNewPost(true);
                    setIndexOfCurrentImage(0);
                  }}
                >
                  Далее
                </div>
              </div>
              <ImageContainerForNewPost />
            </div>
          )}
        </div>
      ) : (
        <ModalWindowOfReadyNewPost />
      )}
    </div>
  );
};

export default NewPostModalWindow;
