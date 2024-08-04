import React from "react";
import { newPostStore } from "../../store/store";
import CollectionOfImagesInNewPost from "../collection_of_images_in_new_post/CollectionOfImagesInNewPost";
import style from "./ImageContainerForNewPost.module.css";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const ImageContainerForNewPost: React.FC = () => {
  const isOpenedNewPostModalWindow = newPostStore(state => state.isOpenedNewPostModalWindow);
  const isOpenedModalWindowOfReadyNewPost = newPostStore(
    state => state.isOpenedModalWindowOfReadyNewPost
  );
  const images = newPostStore(state => state.images);
  const isOpenedCollectionOfImagesWindow = newPostStore(
    state => state.isOpenedCollectionOfImagesWindow
  );
  const setIsOpenedCollectionOfImagesWindow = newPostStore(
    state => state.setIsOpenedCollectionOfImagesWindow
  );
  const indexOfCurrentImage = newPostStore(state => state.indexOfCurrentImage);
  const setIndexOfCurrentImage = newPostStore(state => state.setIndexOfCurrentImage);

  return (
    <div
      style={
        isOpenedNewPostModalWindow && !isOpenedModalWindowOfReadyNewPost
          ? {
              height: "90%",
              backgroundImage: `url(${URL.createObjectURL(images[indexOfCurrentImage])})`,
              borderBottomRightRadius: "13px"
            }
          : {
              // стилизация для компонента ready new post
              height: "90%",
              backgroundImage: `url(${URL.createObjectURL(images[indexOfCurrentImage])})`
            }
      }
      className={style.imageContainerOfModalWindow}
    >
      {images.length > 1 ? (
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
          {indexOfCurrentImage !== images.length - 1 && (
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
          )}
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
