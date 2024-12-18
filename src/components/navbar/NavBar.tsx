import React from "react";
import { NavLink } from "react-router-dom";
import { newPostStore, userStore, accountStore } from "../../store/store";
import style from "./NavBar.module.css";
import * as Icon from "react-bootstrap-icons";

const NavBar: React.FC = () => {
  const setIsOpenedNewPostModalWindow = newPostStore(state => state.setIsOpenedNewPostModalWindow);
  const user = userStore(state => state.user);
  const account = accountStore(state => state.user);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  return (
    <div className={style.container}>
      <div className={style.instagramLogo}></div>
      <div className={style.navBarContainer}>
        <NavLink to={"/home"} className={style.navBarItemContainer}>
          <Icon.House className={style.navBarIcon} />
          <div>Главная</div>
        </NavLink>
        <div className={style.navBarItemContainer}>
          <Icon.Search className={style.navBarIcon} />
          <div>Поисковой запрос</div>
        </div>
        <div className={style.navBarItemContainer}>
          <Icon.Compass className={style.navBarIcon} />
          <div>Интересное</div>
        </div>
        <div className={style.navBarItemContainer}>
          <Icon.Film className={style.navBarIcon} />
          <div>Reels</div>
        </div>
        <div className={style.navBarItemContainer}>
          <Icon.ChatText className={style.navBarIcon} />
          <div>Сообщения</div>
        </div>
        <div className={style.navBarItemContainer}>
          <Icon.Heart className={style.navBarIcon} />
          <div>Уведомления</div>
        </div>
        <div
          onClick={() => setIsOpenedNewPostModalWindow(true)}
          className={style.navBarItemContainer}
        >
          <Icon.PlusSquare className={style.navBarIcon} />
          <div>Создать</div>
        </div>
        <NavLink
          to={`/accounts/${user?.login}`}
          onClick={() => {
            if (user?.login !== account?.login) setReloudAccountPage();
          }}
          className={style.navBarItemContainer}
        >
          {user?.avatar ? (
            <img src={user.avatar} className={style.avatarIcon} />
          ) : (
            <Icon.PersonCircle className={style.defaultAvatar} />
          )}
          <div>Профиль</div>
        </NavLink>
        <div className={style.navBarItemContainer}>
          <Icon.List className={style.navBarIcon} />
          <div>Еще</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
