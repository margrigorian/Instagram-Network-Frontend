import React from "react";
import { NavLink } from "react-router-dom";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { searchStore } from "../../store/searchStore";
import { ISearchAccount } from "../../store/types/searchStoreTypes";
import style from "./SearchUser.module.css";
import * as Icon from "react-bootstrap-icons";

interface ISearchProps {
  searchUser: ISearchAccount;
  addSubscription?: ((login: string) => void) | null;
}

const SearchUser: React.FC<ISearchProps> = ({ searchUser, addSubscription }) => {
  const account = accountStore(state => state.user);
  const user = userStore(state => state.user);
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);
  const isOpenedFollowersAndFollowingsModalWindow = accountStore(
    state => state.isOpenedFollowersAndFollowingsModalWindow
  );
  const setIsOpenedFollowersAndFollowingsModalWindow = accountStore(
    state => state.setIsOpenedFollowersAndFollowingsModalWindow
  );
  const setIsOpenedSearchDrawer = searchStore(state => state.setIsOpenedSearchDrawer);
  const setSearch = searchStore(state => state.setSearch);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);

  return (
    <div className={style.account}>
      <NavLink
        to={`/accounts/${searchUser.login}`}
        onClick={() => {
          // чтобы перезагрузилась страница и выполнился request по новому юзеру
          setReloudAccountPage();
          if (isOpenedFollowersAndFollowingsModalWindow) {
            setIsOpenedFollowersAndFollowingsModalWindow(false);
          }
          setIsOpenedSearchDrawer(false);
          setSearch("");
          setSearchAccounts([]);
        }}
      >
        {searchUser.avatar ? (
          <img src={searchUser.avatar} className={style.avatarIcon} />
        ) : (
          <Icon.PersonCircle className={style.defaultAvatar} />
        )}
      </NavLink>
      <div>
        <div className={style.loginContainer}>
          <NavLink
            to={`/accounts/${searchUser.login}`}
            onClick={() => {
              // чтобы перезагрузилась страница и выполнился request по новому юзеру
              setReloudAccountPage();
              if (isOpenedFollowersAndFollowingsModalWindow) {
                setIsOpenedFollowersAndFollowingsModalWindow(false);
              }
              setIsOpenedSearchDrawer(false);
              setSearch("");
              setSearchAccounts([]);
            }}
            className={style.login}
          >
            {searchUser.login}
          </NavLink>
          {searchUser.verification ? <div className={style.verificationIcon}></div> : ""}
          {account?.login === user?.login &&
            !searchUser?.follow_account &&
            // так как функция указана как опциональное свойство
            addSubscription && (
              <div className={style.subscriptionContainer}>
                <Icon.Dot style={{ fontSize: "8px" }} />
                <div
                  className={style.subscriptionButton}
                  onClick={() => {
                    addSubscription(searchUser.login);
                  }}
                >
                  Подписаться
                </div>
              </div>
            )}
        </div>
        {searchUser.username ? <div className={style.username}>{searchUser.username}</div> : ""}
      </div>
    </div>
  );
};

export default SearchUser;
