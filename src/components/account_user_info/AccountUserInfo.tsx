import React from "react";
import { NavLink } from "react-router-dom";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import {
  postSubscriptionOnAccount,
  deleteSubscriptionOnAccount
} from "../../lib/requests/accountRequests";
import style from "./AccountUserInfo.module.css";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import * as Icon from "react-bootstrap-icons";

interface IAccountUserInfoProps {
  handleFollowersAndFollowingsModalOpen: (path: string) => void;
}

const AccountUserInfo: React.FC<IAccountUserInfoProps> = ({
  handleFollowersAndFollowingsModalOpen
}) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const followers = userStore(state => state.followers);
  const followings = userStore(state => state.followings);
  const addFollowing = userStore(state => state.addFollowing);
  const deleteFollowing = userStore(state => state.deleteFollowing);
  const account = accountStore(state => state.user);
  const posts = accountStore(state => state.posts);
  const followersCount = accountStore(state => state.followers_count);
  const followingsCount = accountStore(state => state.followings_count);
  const increaseFollowersCount = accountStore(state => state.increaseFollowersCount);
  const decreaseFollowersCount = accountStore(state => state.decreaseFollowersCount);
  const setIsOpenedAuthorizationWarningModalWindow = accountStore(
    state => state.setIsOpenedAuthorizationWarningModalWindow
  );
  // проверка связи с юзера с текущим акаунтом
  const isFollower = followers.find(el => el.login === account?.login);
  const isSubscription = followings.find(el => el.login === account?.login);

  async function addSubscriptionOnAccount() {
    // проверка, требуемая типизацией
    if (account?.login && token) {
      await postSubscriptionOnAccount(account.login, token);
      addFollowing(account.login);
      increaseFollowersCount();
    }
  }

  async function removeSubscriptionOnAccount() {
    // проверка, требуемая типизацией
    if (account?.login && token) {
      await deleteSubscriptionOnAccount(account.login, token);
      deleteFollowing(account.login);
      decreaseFollowersCount();
    }
  }

  return (
    <div>
      <div className={style.userInfoContainer}>
        {account?.avatar ? (
          <img src={account.avatar} className={style.avatar} />
        ) : (
          <Icon.PersonCircle className={style.defaultAvatar} />
        )}

        <div>
          {user?.login === account?.login ? (
            // страница профиля
            <div className={style.sittingsContainer}>
              <div className={style.loginContainer}>
                <div className={style.login}>{account?.login}</div>
                {account?.verification ? <div className={style.verificationIcon}></div> : ""}
              </div>
              <NavLink to={"/profile/edit"}>
                <button style={{ padding: "10px 20px 7px 20px" }} className={style.button}>
                  Редактировать профиль
                </button>
              </NavLink>
              <button style={{ padding: "10px 20px 7px 20px" }} className={style.button}>
                Посмотреть архив
              </button>
              <Icon.GearWide size={"24px"} cursor={"pointer"} />
            </div>
          ) : // другие аккаунты
          isSubscription ? (
            // мы подписаны
            <div className={style.sittingsContainer}>
              <div className={style.loginContainer}>
                <div className={style.login}>{account?.login}</div>
                {account?.verification ? <div className={style.verificationIcon}></div> : ""}
              </div>
              <button
                className={`${style.button} ${style.subscriptionsButton}`}
                onClick={() => {
                  removeSubscriptionOnAccount();
                }}
              >
                Отменить
              </button>
              <button style={{ padding: "10px 20px 7px 20px" }} className={style.button}>
                Отправить сообщение
              </button>
              {account?.recommendation ? (
                <button className={style.recommendationButton}>
                  <PersonAddAltOutlinedIcon sx={{ fontSize: "18px" }} />
                </button>
              ) : (
                ""
              )}
              <MoreHorizOutlinedIcon sx={{ cursor: "pointer" }} />
            </div>
          ) : (
            // мы не подписаны
            <div className={style.sittingsContainer}>
              <div className={style.loginContainer}>
                <div className={style.login}>{account?.login}</div>
                {account?.verification ? <div className={style.verificationIcon}></div> : ""}
              </div>
              <button
                className={style.blueButton}
                onClick={() => {
                  if (user) {
                    addSubscriptionOnAccount();
                  } else {
                    setIsOpenedAuthorizationWarningModalWindow(true);
                  }
                }}
              >
                {isFollower ? "Подписаться в ответ" : "Подписаться"}
              </button>
              <button
                style={{ padding: "10px 20px 7px 20px" }}
                className={style.button}
                onClick={() => {
                  if (user === null) {
                    setIsOpenedAuthorizationWarningModalWindow(true);
                  }
                }}
              >
                Отправить сообщение
              </button>
              {account?.recommendation ? (
                <button className={style.recommendationButton}>
                  <PersonAddAltOutlinedIcon sx={{ fontSize: "18px" }} />
                </button>
              ) : (
                ""
              )}
              <MoreHorizOutlinedIcon sx={{ cursor: "pointer" }} />
            </div>
          )}

          <div className={style.containerOfnumberOfsubscriptionsAndPosts}>
            <div>
              <span className={style.spanOfNumber}>{posts.length}</span>
              публикаций
            </div>
            <div
              className={style.followersContainer}
              onClick={() => {
                if (user) {
                  handleFollowersAndFollowingsModalOpen("followers");
                } else {
                  setIsOpenedAuthorizationWarningModalWindow(true);
                }
              }}
            >
              <span className={style.spanOfNumber}>{followersCount}</span>
              подписчиков
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (user) {
                  handleFollowersAndFollowingsModalOpen("following");
                } else {
                  setIsOpenedAuthorizationWarningModalWindow(true);
                }
              }}
            >
              <span className={style.spanOfNumber}>{followingsCount}</span>
              подписок
            </div>
          </div>
          <div className={style.username}>{account?.username}</div>
          <div className={style.aboutText}>{account?.about}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountUserInfo;
