import React, { useRef, Dispatch, SetStateAction } from "react";
import { userStore } from "../../store/userStore";
import { postAvatar, putAvatar, deleteAvatar } from "../../lib/requests/userRequests";
import style from "./ChangeAvatarModalWindow.module.css";

interface IModalWindowProps {
  setIsOpenedModalUploadWindow: Dispatch<SetStateAction<boolean>>;
}

const ChangeAvatarModalWindow: React.FC<IModalWindowProps> = ({ setIsOpenedModalUploadWindow }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const imagePicker = useRef(null);
  const setAvatar = userStore(state => state.setAvatar);

  async function changeAvatar(image: File): Promise<void> {
    const formData = new FormData();
    formData.append("image", image);

    if (token) {
      // так как при просмотре аккаунтов без авторизации токен равен null; проверка требуется типизацией
      if (user?.avatar) {
        // нужно для middleware, т.к. путь обновления avatar и user info один
        formData.append("about", "");
        formData.append("gender", "null");
        formData.append("recommendation", "true");

        const avatar = await putAvatar(formData, token);
        if (avatar?.data) {
          setAvatar(avatar.data.image);
        }
      } else {
        // post
        const avatar = await postAvatar(formData, token);
        if (avatar?.data) {
          setAvatar(avatar.data.image);
        }
      }
    }

    setIsOpenedModalUploadWindow(false);
  }

  return (
    <div
      onClick={() => {
        setIsOpenedModalUploadWindow(false);
      }}
      className={style.modalContainer}
    >
      <div
        className={style.modal}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className={style.photoModificationHeaderText}>Изменить фото профиля</div>
        <input
          type="file"
          accept="image/*,.png,.jpeg,.jpg"
          className={style.hiddenImageInput}
          ref={imagePicker}
          onChange={evt => {
            const inputsFile = evt.target as HTMLInputElement;
            // проверка для исключения ошибки
            if (inputsFile.files && inputsFile.files[0]) {
              changeAvatar(inputsFile.files[0]);
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
          className={style.photoLoadingElement}
        >
          Загрузить фото
        </div>
        <div
          onClick={async () => {
            if (token) {
              if (user?.avatar !== null) {
                await deleteAvatar(token);
              }
              setAvatar(null);
              setIsOpenedModalUploadWindow(false);
            }
          }}
          className={style.photoDeletionElement}
        >
          Удалить фото
        </div>
        <div
          onClick={() => {
            setIsOpenedModalUploadWindow(false);
          }}
          className={style.cancellation}
        >
          Отмена
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatarModalWindow;
