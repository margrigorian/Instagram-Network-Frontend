import React, { useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import ChangeAvatarModalWindow from "../../components/change_avatar_modal_window/ChangeAvatarModalWindow";
import GenderSelectionBlock from "../../components/gender_selection_block/GenderSelectionBlock";
import { userStore } from "../../store/userStore";
import { searchStore } from "../../store/searchStore";
import { putUserInfo, deleteAvatarOrAccount } from "../../lib/requests/userRequests";
import { getSearchAccounts } from "../../lib/requests/accountRequests";
import style from "./EditProfilePage.module.css";
import { IOSSwitch } from "../../theme/theme";
import * as Icon from "react-bootstrap-icons";

const EditProfilePage: React.FC = () => {
  const user = userStore(state => state.user);
  const setUser = userStore(state => state.setUser);
  const token = userStore(state => state.token);
  const setToken = userStore(state => state.setToken);
  const [isOpenedModalUploadWindow, setIsOpenedModalUploadWindow] = useState(false);
  const [isOpenedModalGenderSelectionWindow, setIsOpenedModalGenderSelectionWindow] =
    useState(false);
  const [isOpenedModalWindowForSavingChanges, setisOpenedMdalWindowForSavingChanges] =
    useState(false);
  // чтобы исключить undefined
  const [textAbout, setTextAbout] = useState(user && user.about ? user.about : "");
  // чтобы исключить undefined
  const [backendGenderValue, setBackendGenderValue] = useState(user ? user.gender : null);
  // чтобы в случае "своего варианта" в input сразу отоборажались данные пользователя
  const [individualGenderType, setIndividualGenderType] = useState(
    user?.gender && user.gender !== "#1female" && user.gender !== "#2male" ? user.gender : ""
  );
  const [recommendation, setRecommendation] = useState(user ? user.recommendation : true);
  const [isOpenedAccountDeletionModalWindow, setIsOpenedAccountDeletionModalWindow] =
    useState(false);

  async function updateUserInfo(): Promise<void> {
    const data = {
      about: textAbout,
      gender: backendGenderValue,
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

  async function deleteAccount() {
    if (token) {
      await deleteAvatarOrAccount(token);
      setUser(null);
      setToken(null);
      setIsOpenedAccountDeletionModalWindow(false);
    }
  }

  const search = searchStore(state => state.search);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);

  useEffect(() => {
    async function makeRequest() {
      // проверка, требуемая типизацией
      if (token) {
        const requestedAccounts = await getSearchAccounts(search, token);

        if (requestedAccounts) {
          setSearchAccounts(requestedAccounts);
        }
      }
    }

    makeRequest();
  }, [search]);

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

          {isOpenedAccountDeletionModalWindow && (
            <div
              className={style.containerOfAccountDeletionModalWindow}
              onClick={() => {
                setIsOpenedAccountDeletionModalWindow(false);
              }}
            >
              <div className={style.accountDeletionModalWindow} onClick={e => e.stopPropagation()}>
                <div className={style.deletionText}>Аккаунт будет удален безвозвратно</div>
                <div className={style.deleteButtonContainer}>
                  <NavLink
                    to={"/"}
                    onClick={() => {
                      deleteAccount();
                    }}
                    className={`${style.button} ${style.deleteButton}`}
                  >
                    Удалить
                  </NavLink>
                  <div
                    className={`${style.button} ${style.cancelButton}`}
                    onClick={() => {
                      setIsOpenedAccountDeletionModalWindow(false);
                    }}
                  >
                    Отмена
                  </div>
                </div>
              </div>
            </div>
          )}

          <NavBar />
          <div className={style.settingsContainer}>
            <div className={style.headerTextOfSettings}>Настройки</div>
            <div
              className={style.deleteAccountButton}
              onClick={() => setIsOpenedAccountDeletionModalWindow(true)}
            >
              Удалить аккаунт
            </div>
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
                  (user.gender !== backendGenderValue && backendGenderValue !== "") ||
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
                  (user.gender !== backendGenderValue && backendGenderValue !== "") ||
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
