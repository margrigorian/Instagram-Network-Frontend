import React from "react";
import { NavLink } from "react-router-dom";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { storeOfEditedPost } from "../../store/postStore";
import { searchStore } from "../../store/searchStore";
import style from "./NavBar.module.css";
import * as Icon from "react-bootstrap-icons";

const NavBar: React.FC = () => {
  const setIsOpenedNewPostModalWindow = storeOfEditedPost(
    state => state.setIsOpenedNewPostModalWindow
  );
  const user = userStore(state => state.user);
  const account = accountStore(state => state.user);
  const isOpenedSearchDrawer = searchStore(state => state.isOpenedSearchDrawer);
  const setIsOpenedSearchDrawer = searchStore(state => state.setIsOpenedSearchDrawer);
  const setSearch = searchStore(state => state.setSearch);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  return (
    <div className={style.container}>
      <div className={style.instagramLogo}></div>
      <div className={style.navBarContainer}>
        <NavLink
          to={"/home"}
          className={style.navBarItemContainer}
          onClick={() => {
            if (isOpenedSearchDrawer) {
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            }
          }}
        >
          <Icon.House className={style.navBarIcon} />
          <div>Главная</div>
        </NavLink>
        <div
          className={style.navBarItemContainer}
          onClick={() => {
            if (isOpenedSearchDrawer) {
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            } else {
              setIsOpenedSearchDrawer(true);
            }
          }}
        >
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
          onClick={() => {
            if (isOpenedSearchDrawer) {
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            }
            setIsOpenedNewPostModalWindow(true);
          }}
          className={style.navBarItemContainer}
        >
          <Icon.PlusSquare className={style.navBarIcon} />
          <div>Создать</div>
        </div>
        <NavLink
          to={`/accounts/${user?.login}`}
          onClick={() => {
            if (isOpenedSearchDrawer) {
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            }
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
