import React from "react";
import CollectionOfImagesInNewPost from "../collection_of_images_in_new_post/CollectionOfImagesInNewPost";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { postStore, storeOfEditedPost } from "../../store/postStore";
import { deleteImage } from "../../lib/requests/postsRequests";
import style from "./ImageContainerOfEditedPost.module.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const ImageContainerForNewPost: React.FC = () => {
  const token = userStore(state => state.token);
  const isOpenedNewPostModalWindow = storeOfEditedPost(state => state.isOpenedNewPostModalWindow);
  const isOpenedModalWindowOfReadyNewPost = storeOfEditedPost(
    state => state.isOpenedModalWindowOfReadyNewPost
  );
  const files = storeOfEditedPost(state => state.files);
  const isOpenedCollectionOfImagesWindow = storeOfEditedPost(
    state => state.isOpenedCollectionOfImagesWindow
  );
  const setIsOpenedCollectionOfImagesWindow = storeOfEditedPost(
    state => state.setIsOpenedCollectionOfImagesWindow
  );
  const indexOfCurrentImage = storeOfEditedPost(state => state.indexOfCurrentImage);
  const setIndexOfCurrentImage = storeOfEditedPost(state => state.setIndexOfCurrentImage);
  // для редакции изображений поста
  const post_id = storeOfEditedPost(state => state.postId);
  const isOpenedPostEditModalWindow = postStore(state => state.isOpenedPostEditModalWindow);
  const imagesOfEditedPost = storeOfEditedPost(state => state.imagesOfEditedPost);
  const deleteImageInEditedPost = storeOfEditedPost(state => state.deleteImageInEditedPost);
  const deleteImageOfPostInStore = accountStore(state => state.deleteImageOfPostInStore);

  async function deletePostImage(img_index: number) {
    // проверка, требуемая типизацией
    if (token && post_id) {
      await deleteImage(post_id, img_index, token);
      if (indexOfCurrentImage > 0) {
        setIndexOfCurrentImage(indexOfCurrentImage - 1);
      }
      // в модальном окне редактирвования
      deleteImageInEditedPost(img_index);
      // в сторе
      deleteImageOfPostInStore(post_id, img_index);
    }
  }

  return (
    <div
      style={
        isOpenedNewPostModalWindow && !isOpenedModalWindowOfReadyNewPost
          ? {
              height: "90%",
              backgroundImage:
                // процесс редактирования изображения уже существующего поста
                isOpenedPostEditModalWindow
                  ? `url(${imagesOfEditedPost[indexOfCurrentImage].image})`
                  : // загруженные файлы с изображениями для новго поста
                    `url(${URL.createObjectURL(files[indexOfCurrentImage])})`,
              borderBottomRightRadius: "13px"
            }
          : {
              // стилизация для компонента ready new post
              height: "90%",
              backgroundImage: isOpenedPostEditModalWindow
                ? `url(${imagesOfEditedPost[indexOfCurrentImage].image})`
                : `url(${URL.createObjectURL(files[indexOfCurrentImage])})`
            }
      }
      className={style.imageContainerOfModalWindow}
    >
      {files.length > 1 || imagesOfEditedPost.length > 1 ? (
        <div
          className={style.arrowAndBasketContainer}
          style={isOpenedModalWindowOfReadyNewPost ? { height: "48%" } : { height: "50%" }}
        >
          {isOpenedPostEditModalWindow && imagesOfEditedPost.length > 0 ? (
            <DeleteOutlineIcon
              className={style.basket}
              sx={{ fontSize: "19px" }}
              onClick={() => {
                deletePostImage(imagesOfEditedPost[indexOfCurrentImage].img_index);
              }}
            />
          ) : (
            <div></div>
          )}
          <div className={style.arrowContainer}>
            {indexOfCurrentImage !== 0 ? (
              <div
                className={style.arrow}
                onClick={() => {
                  setIndexOfCurrentImage(indexOfCurrentImage - 1);
                  if (isOpenedCollectionOfImagesWindow) {
                    setIsOpenedCollectionOfImagesWindow(false);
                  }
                }}
              >
                <KeyboardArrowLeftOutlinedIcon sx={{ fontSize: "26px" }} />
              </div>
            ) : (
              <div></div>
            )}
            {indexOfCurrentImage < files.length - 1 ||
            indexOfCurrentImage < imagesOfEditedPost.length - 1 ? (
              <div
                className={style.arrow}
                onClick={() => {
                  setIndexOfCurrentImage(indexOfCurrentImage + 1);
                  if (isOpenedCollectionOfImagesWindow) {
                    setIsOpenedCollectionOfImagesWindow(false);
                  }
                }}
              >
                <KeyboardArrowRightOutlinedIcon sx={{ fontSize: "26px" }} />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        // чтобы компонент коллекции изображений оставался внизу
        <div style={{ height: "50%" }}></div>
      )}
      {isOpenedNewPostModalWindow && !isOpenedModalWindowOfReadyNewPost && (
        <CollectionOfImagesInNewPost />
      )}
    </div>
  );
};

export default ImageContainerForNewPost;
