import React from "react";
import { userStore, accountStore } from "../../store/store";
import style from "./AccountUserInfo.module.css";
import * as Icon from "react-bootstrap-icons";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

const AccountUserInfo: React.FC = () => {
  const user = userStore(state => state.user);
  const account = accountStore(state => state.user);
  const posts = accountStore(state => state.posts);
  const followers = accountStore(state => state.followers);
  const following = accountStore(state => state.following);

  const isFollower = followers.find(el => el.id === account?.id);
  const isSubscription = following.find(el => el.login === account?.login);

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
              <button style={{ padding: "10px 20px 7px 20px" }} className={style.button}>
                Редактировать профиль
              </button>
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
              <button className={`${style.button} ${style.subscriptionsButton}`}>
                Подписки
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "22px" }} />
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
              <button className={style.blueButton}>
                {isFollower ? "Подписаться в ответ" : "Подписаться"}
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
          )}

          <div className={style.containerOfnumberOfsubscriptionsAndPosts}>
            <div>
              <span className={style.spanOfNumber}>{posts.length}</span>
              публикаций
            </div>
            <div className={style.followersContainer}>
              <span className={style.spanOfNumber}>{followers.length}</span>
              подписчиков
            </div>
            <div style={{ cursor: "pointer" }}>
              <span className={style.spanOfNumber}>{following.length}</span>
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
