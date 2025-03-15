import React from "react";
import { NavLink } from "react-router-dom";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { searchStore } from "../../store/searchStore";
import { IListedAccount } from "../../store/types/accountStoreTypes";
import style from "./ListedAccount.module.css";
import * as Icon from "react-bootstrap-icons";

interface IListedAccountProps {
  listedAccount: IListedAccount;
  addSubscription?: ((login: string) => void) | null;
}

const ListedAccount: React.FC<IListedAccountProps> = ({ listedAccount, addSubscription }) => {
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
        to={`/accounts/${listedAccount.login}`}
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
        {listedAccount.avatar ? (
          <img src={listedAccount.avatar} className={style.avatarIcon} />
        ) : (
          <Icon.PersonCircle className={style.defaultAvatar} />
        )}
      </NavLink>
      <div>
        <div className={style.loginContainer}>
          <NavLink
            to={`/accounts/${listedAccount.login}`}
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
            {listedAccount.login}
          </NavLink>
          {listedAccount.verification ? <div className={style.verificationIcon}></div> : ""}
          {account?.login === user?.login &&
            !listedAccount?.follow_account &&
            // так как функция указана как опциональное свойство
            addSubscription && (
              <div className={style.subscriptionContainer}>
                <Icon.Dot style={{ fontSize: "8px" }} />
                <div
                  className={style.subscriptionButton}
                  onClick={() => {
                    addSubscription(listedAccount.login);
                  }}
                >
                  Подписаться
                </div>
              </div>
            )}
        </div>
        <div className={style.username}>{listedAccount.username}</div>
        <div className={style.followersLogins}>{listedAccount.followers}</div>
      </div>
    </div>
  );
};

export default ListedAccount;
