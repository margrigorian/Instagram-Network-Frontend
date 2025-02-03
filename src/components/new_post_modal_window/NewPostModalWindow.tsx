import React, { useRef, useState } from "react";
import ImageContainerOfEditedPost from "../ImageContainerOfEditedPost/ImageContainerOfEditedPost";
import ModalWindowOfReadyNewPost from "../modal_window_of_ready_new_post/ModalWindowOfReadyNewPost";
import { storeOfEditedPost } from "../../store/store";
import style from "./NewPostModalWindow.module.css";
import * as Icon from "react-bootstrap-icons";

const NewPostModalWindow: React.FC = () => {
  const setIsOpenedNewPostModalWindow = storeOfEditedPost(
    state => state.setIsOpenedNewPostModalWindow
  );
  const isOpenedModalWindowOfReadyNewPost = storeOfEditedPost(
    state => state.isOpenedModalWindowOfReadyNewPost
  );
  const setIsOpenedModalWindowOfReadyNewPost = storeOfEditedPost(
    state => state.setIsOpenedModalWindowOfReadyNewPost
  );
  const [modalWindowForDeletingThePublication, setModalWindowForDeletingThePublication] =
    useState(false);
  const files = storeOfEditedPost(state => state.files);
  const setFiles = storeOfEditedPost(state => state.setFiles);
  const isOpenedCollectionOfImagesWindow = storeOfEditedPost(
    state => state.isOpenedCollectionOfImagesWindow
  );
  const setIsOpenedCollectionOfImagesWindow = storeOfEditedPost(
    state => state.setIsOpenedCollectionOfImagesWindow
  );
  const deleteAllFiles = storeOfEditedPost(state => state.deleteAllFiles);
  const setIndexOfCurrentImage = storeOfEditedPost(state => state.setIndexOfCurrentImage);
  const setPostCaption = storeOfEditedPost(state => state.setPostCaption);

  const imagePicker = useRef(null);

  return (
    <div
      onClick={() => {
        if (files.length > 0) {
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
            <div className={style.alertModalWindowText} style={{ fontSize: "16px" }}>
              Удалить публикацию?
            </div>
            <div
              className={`${style.alertModalWindowText} ${style.textBorder}`}
              onClick={() => {
                // закрытие Alert Modal Window
                setModalWindowForDeletingThePublication(false);
                // закрытие основных модальных окон
                setIsOpenedNewPostModalWindow(false);
                setIsOpenedModalWindowOfReadyNewPost(false);
                // удаление всех загруженных фото
                deleteAllFiles();
                // удаление подписи
                setPostCaption("");
              }}
            >
              Удалить
            </div>
            <div
              className={style.alertModalWindowText}
              style={{ cursor: "pointer" }}
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
          {files.length === 0 ? (
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
                      setFiles(inputsFile.files[0]);
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
                    deleteAllFiles();
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
              <ImageContainerOfEditedPost />
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
