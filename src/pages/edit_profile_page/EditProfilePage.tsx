import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { userStore } from "../../store/store";
import { putUserInfo } from "../../lib/request";
import NavBar from "../../components/navbar/NavBar";
import ChangeAvatarModalWindow from "../../components/change_avatar_modal_window/ChangeAvatarModalWindow";
import GenderSelectionBlock from "../../components/gender_selection_block/GenderSelectionBlock";
import { IOSSwitch } from "../../theme/theme";
import style from "./EditProfilePage.module.css";
import * as Icon from "react-bootstrap-icons";

const EditProfilePage: React.FC = () => {
  const user = userStore(state => state.user);
  const setUser = userStore(state => state.setUser);
  const token = userStore(state => state.token);
  const [isOpenedModalUploadWindow, setIsOpenedModalUploadWindow] = useState(false);
  const [isOpenedModalGenderSelectionWindow, setIsOpenedModalGenderSelectionWindow] =
    useState(false);
  const [isOpenedModalWindowForSavingChanges, setisOpenedMdalWindowForSavingChanges] =
    useState(false);
  // чтобы исключить undefined
  const [textAbout, setTextAbout] = useState(user && user.about ? user.about : "");
  // чтобы исключить undefined
  const [backendGenderValue, setBackendGenderValue] = useState(user ? user.gender : null);
  const [individualGenderType, setIndividualGenderType] = useState("");
  const [recommendation, setRecommendation] = useState(user ? user.recommendation : true);

  async function updateUserInfo() {
    const data = {
      about: textAbout,
      gender: individualGenderType ? individualGenderType : backendGenderValue,
      recommendation
    };

    if (token) {
      const user = await putUserInfo(data, token);

      if (user?.data) {
        setUser(user.data);
        setisOpenedMdalWindowForSavingChanges(true);
      }
    }
  }

  return (
    <div>
      {/* если без логина, будет перенаправление на страницу входа */}
      {user ? (
        <div
          onClick={() => {
            setIsOpenedModalGenderSelectionWindow(false);
          }}
          className={style.container}
        >
          {isOpenedModalUploadWindow && (
            <ChangeAvatarModalWindow setIsOpenedModalUploadWindow={setIsOpenedModalUploadWindow} />
          )}

          <NavBar />
          <div className={style.settingsContainer}>
            <div className={style.headerTextOfSettings}>Настройки</div>
          </div>
          <div className={style.editContainer}>
            <div className={style.headerTextOfEditing}>Редактировать профиль</div>
            <div className={style.avatarContainer}>
              <div className={style.userInfoContainer}>
                {user.avatar ? (
                  <img src={user.avatar} className={style.avatar} />
                ) : (
                  <Icon.PersonCircle className={style.defaultAvatar} />
                )}
                <div>
                  <div className={style.login}>{user.login}</div>
                  <div className={style.username}>{user.username}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpenedModalUploadWindow(true);
                }}
                className={style.newAvatarButton}
              >
                Новое фото
              </button>
            </div>

            <div className={style.containerOfEditingItem}>
              <div className={style.headerTextOfEditingItem}>Сайт</div>
              <input disabled={true} placeholder="Сайт" className={style.websiteInput} />
              <div className={style.explanatoryText}>
                Изменить ссылки можно только в мобильной версии. Перейдите в приложение Instagram и
                коснитесь &quot;Редактировать профиль&quot;.
              </div>
            </div>

            <div className={style.containerOfEditingItem}>
              <div className={style.headerTextOfEditingItem}>О себе</div>
              <div className={style.textareaContainer}>
                <textarea
                  placeholder="О себе"
                  maxLength={150}
                  className={style.aboutTextArea}
                  value={textAbout ? textAbout : ""}
                  onChange={e => setTextAbout(e.target.value)}
                ></textarea>
                <div className={style.counterText}>
                  <span className={style.counterTextCurrent}>
                    {textAbout ? textAbout.length : 0}
                  </span>
                  &nbsp;/&nbsp;
                  <span className={style.counterTextTotal}>150</span>
                </div>
              </div>
            </div>

            <GenderSelectionBlock
              isOpenedModalGenderSelectionWindow={isOpenedModalGenderSelectionWindow}
              setIsOpenedModalGenderSelectionWindow={setIsOpenedModalGenderSelectionWindow}
              backendGenderValue={backendGenderValue}
              setBackendGenderValue={setBackendGenderValue}
              individualGenderType={individualGenderType}
              setIndividualGenderType={setIndividualGenderType}
            />

            <div className={style.containerOfEditingItem}>
              <div className={style.headerTextOfEditingItem}>
                Включить рекомендацию аккаунтов в профилях
              </div>
              <div className={style.recommendationContainer}>
                <div>
                  <div>Включить рекомендацию аккаунтов в профилях</div>
                  <div className={style.explanatoryTextOfRecommendation}>
                    Выберите, если хотите, чтобы люди могли видеть похожие рекомендуемые аккаунты в
                    вашем профиле, а ваш аккаунт можно было рекомендовать в других профилях.
                  </div>
                </div>
                <IOSSwitch
                  sx={{ m: 1 }}
                  checked={recommendation}
                  onChange={e => {
                    setRecommendation(e.target.checked);
                  }}
                />
              </div>
            </div>
            <div className={style.sendButtonContainer}>
              <button
                // кнопка станет доступной при изменениях
                disabled={
                  user.about !== textAbout ||
                  user.gender !== backendGenderValue ||
                  user.recommendation !== recommendation
                    ? false
                    : true
                }
                onClick={() => {
                  setisOpenedMdalWindowForSavingChanges(false);
                  updateUserInfo();
                }}
                className={
                  user.about !== textAbout ||
                  user.gender !== backendGenderValue ||
                  user.recommendation !== recommendation
                    ? style.sendButton
                    : style.disabledSendButton
                }
              >
                Отправить
              </button>
            </div>
          </div>
          {isOpenedModalWindowForSavingChanges && (
            <div className={style.modalWindowForSavingChanges}>Профиль сохранен.</div>
          )}
        </div>
      ) : (
        <Navigate to="/" replace />
      )}
    </div>
  );
};

export default EditProfilePage;
