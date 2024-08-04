import React, { useRef, useState } from "react";
import { newPostStore } from "../../store/store";
import style from "./CollectionOfImagesInNewPost.module.css";
import * as Icon from "react-bootstrap-icons";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const CollectionOfImagesInNewPost: React.FC = () => {
  const images = newPostStore(state => state.images);
  const setImages = newPostStore(state => state.setImages);
  const isOpenedCollectionOfImagesWindow = newPostStore(
    state => state.isOpenedCollectionOfImagesWindow
  );
  const setIsOpenedCollectionOfImagesWindow = newPostStore(
    state => state.setIsOpenedCollectionOfImagesWindow
  );
  const deleteCurrentImage = newPostStore(state => state.deleteCurrentImage);
  const indexOfCurrentImage = newPostStore(state => state.indexOfCurrentImage);
  const setIndexOfCurrentImage = newPostStore(state => state.setIndexOfCurrentImage);

  const imagePicker = useRef(null);
  const [initialIndexOfTheImageCollection, setInitialIndexOfTheImageCollection] = useState(0);

  return (
    <div className={style.container}>
      {/* обеспечивает justufy-content: space-between */}
      <div></div>
      {isOpenedCollectionOfImagesWindow && (
        <div className={style.containerOfCollection}>
          {images.map((el, i) =>
            //   чтобы отрисовывалось по три картинки в коллекции
            i >= initialIndexOfTheImageCollection && i <= initialIndexOfTheImageCollection + 2 ? (
              <div
                key={`imageId-${i}`}
                style={{
                  backgroundImage: `url(${URL.createObjectURL(el)})`
                }}
                className={style.imagesContainer}
                onClick={() => {
                  setIndexOfCurrentImage(i);
                }}
              >
                {i === indexOfCurrentImage ? (
                  <div className={style.imageContainerWithCrossIcon}>
                    <div
                      className={style.crossIconContainer}
                      onClick={e => {
                        e.stopPropagation();

                        if (i !== 0) {
                          setIndexOfCurrentImage(i - 1);
                          setInitialIndexOfTheImageCollection(initialIndexOfTheImageCollection - 1);
                        }
                        deleteCurrentImage(i);
                      }}
                    >
                      <Icon.X size={"20px"} color="white" />
                    </div>
                    {i === initialIndexOfTheImageCollection && i !== 0 ? (
                      <KeyboardArrowLeftOutlinedIcon
                        style={{ marginTop: "10px" }}
                        className={`${style.arrow} ${style.leftArrow}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (initialIndexOfTheImageCollection + 3 >= images.length - 1) {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection - 1
                            );
                          } else {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection - 2
                            );
                          }
                        }}
                      />
                    ) : i === initialIndexOfTheImageCollection + 2 && i !== images.length - 1 ? (
                      <KeyboardArrowRightOutlinedIcon
                        className={`${style.arrow} ${style.rightArrow}`}
                        style={{ marginTop: "10px" }}
                        onClick={e => {
                          e.stopPropagation();
                          if (images.length - 1 - 3 === 0) {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection + 1
                            );
                          } else {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection + 2
                            );
                          }
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <div className={style.darkFonInImageContainer}>
                    {i === initialIndexOfTheImageCollection && i !== 0 ? (
                      <KeyboardArrowLeftOutlinedIcon
                        className={`${style.arrow} ${style.leftArrow}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (initialIndexOfTheImageCollection - 2 >= 0) {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection - 2
                            );
                          } else {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection - 1
                            );
                          }
                        }}
                      />
                    ) : i === initialIndexOfTheImageCollection + 2 && i !== images.length - 1 ? (
                      <KeyboardArrowRightOutlinedIcon
                        className={`${style.arrow} ${style.rightArrow}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (initialIndexOfTheImageCollection + 3 >= images.length - 1) {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection + 1
                            );
                          } else {
                            setInitialIndexOfTheImageCollection(
                              initialIndexOfTheImageCollection + 2
                            );
                          }
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            ) : (
              ""
            )
          )}
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
          <div
            onClick={() => {
              // через ref сработает клик на image input
              if (imagePicker.current) {
                // не null
                (imagePicker.current as HTMLInputElement).click();
              }
            }}
            className={style.addImageButton}
          >
            <Icon.Plus size={"38px"} color="grey " />
          </div>
        </div>
      )}
      <div
        onClick={() => {
          setIsOpenedCollectionOfImagesWindow(!isOpenedCollectionOfImagesWindow);
        }}
        style={
          isOpenedCollectionOfImagesWindow
            ? { backgroundColor: "white" }
            : { backgroundColor: "rgb(255, 255, 255, 0.5)" }
        }
        className={style.collectionIconContainer}
      >
        <div className={style.collectionIcon}></div>
      </div>
    </div>
  );
};

export default CollectionOfImagesInNewPost;
