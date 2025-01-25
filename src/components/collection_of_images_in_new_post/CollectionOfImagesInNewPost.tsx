import React, { useRef, useState } from "react";
import { storeOfEditedPost } from "../../store/store";
import style from "./CollectionOfImagesInNewPost.module.css";
import * as Icon from "react-bootstrap-icons";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const CollectionOfImagesInNewPost: React.FC = () => {
  const files = storeOfEditedPost(state => state.files);
  const setFiles = storeOfEditedPost(state => state.setFiles);
  const isOpenedCollectionOfImagesWindow = storeOfEditedPost(
    state => state.isOpenedCollectionOfImagesWindow
  );
  const setIsOpenedCollectionOfImagesWindow = storeOfEditedPost(
    state => state.setIsOpenedCollectionOfImagesWindow
  );
  const deleteCurrentFile = storeOfEditedPost(state => state.deleteCurrentFile);
  const indexOfCurrentImage = storeOfEditedPost(state => state.indexOfCurrentImage);
  const setIndexOfCurrentImage = storeOfEditedPost(state => state.setIndexOfCurrentImage);

  const imagePicker = useRef(null);
  const [initialIndexOfTheImageCollection, setInitialIndexOfTheImageCollection] = useState(0);

  console.log(`Current=${indexOfCurrentImage}`, `Initial=${initialIndexOfTheImageCollection}`);

  return (
    <div className={style.container}>
      {/* обеспечивает justufy-content: space-between */}
      <div></div>
      {isOpenedCollectionOfImagesWindow && (
        <div className={style.containerOfCollection}>
          {files.map((el, i) =>
            //   чтобы отрисовывалось по три картинки в коллекции
            i >= initialIndexOfTheImageCollection && i <= initialIndexOfTheImageCollection + 2 ? (
              <div
                key={`imageId-${i}`}
                style={{
                  // проверка, требуемая типизацией
                  backgroundImage: el instanceof File ? `url(${URL.createObjectURL(el)})` : ""
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
                        if (
                          initialIndexOfTheImageCollection === 0 &&
                          i !== 0 &&
                          files.length - i === 1
                        ) {
                          setIndexOfCurrentImage(indexOfCurrentImage - 1);
                        } else if (
                          initialIndexOfTheImageCollection !== 0 &&
                          files.length - initialIndexOfTheImageCollection <= 3
                        ) {
                          setInitialIndexOfTheImageCollection(initialIndexOfTheImageCollection - 1);
                          setIndexOfCurrentImage(indexOfCurrentImage - 1);
                        }

                        deleteCurrentFile(i);
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
                          if (initialIndexOfTheImageCollection + 3 >= files.length - 1) {
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
                    ) : i === initialIndexOfTheImageCollection + 2 && i !== files.length - 1 ? (
                      <KeyboardArrowRightOutlinedIcon
                        className={`${style.arrow} ${style.rightArrow}`}
                        style={{ marginTop: "10px" }}
                        onClick={e => {
                          e.stopPropagation();
                          if (initialIndexOfTheImageCollection + 3 >= files.length - 1) {
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
                    ) : i === initialIndexOfTheImageCollection + 2 && i !== files.length - 1 ? (
                      <KeyboardArrowRightOutlinedIcon
                        className={`${style.arrow} ${style.rightArrow}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (initialIndexOfTheImageCollection + 3 >= files.length - 1) {
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
                console.log(inputsFile.files[0]);
                setFiles(inputsFile.files[0]);
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
