import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../search_input/SearchInput";
import SearchUser from "../search_user/SearchUser";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { searchStore } from "../../store/searchStore";
import {
  getFollowersOrFollowings,
  postSubscriptionOnFollowerOrFollowing,
  deleteFollowerOrSubscription
} from "../../lib/requests/accountRequests";
import style from "./FollowersAndFollowingsModalWindow.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const FollowersAndFollowingsModalWindow: React.FC = () => {
  const account = accountStore(state => state.user);
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const addFollowing = userStore(state => state.addFollowing);
  const deleteFollowing = userStore(state => state.deleteFollowing);
  const increaseFollowingsCount = accountStore(state => state.increaseFollowingsCount);
  const decreaseFollowersCount = accountStore(state => state.decreaseFollowersCount);
  const decreaseFollowingsCount = accountStore(state => state.decreaseFollowingsCount);
  const setIsOpenedFollowersAndFollowingsModalWindow = accountStore(
    state => state.setIsOpenedFollowersAndFollowingsModalWindow
  );

  const search = searchStore(state => state.search);
  const setSearch = searchStore(state => state.setSearch);
  const searchAccounts = searchStore(state => state.searchAccounts);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);

  const navigate = useNavigate();
  function handleModalClose() {
    navigate(-1);
    setIsOpenedFollowersAndFollowingsModalWindow(false);
    setSearch("");
    setSearchAccounts([]);
  }

  const url: string = window.location.pathname;
  const urlArr = url.split("/");
  const path = urlArr[urlArr.length - 1];

  useEffect(() => {
    async function makeRequest() {
      // проверка, требуемая типизацией
      if (account && token) {
        const requestedAccounts = await getFollowersOrFollowings(
          account.login,
          path,
          search,
          token
        );

        if (requestedAccounts) {
          setSearchAccounts(requestedAccounts);
        }
      }
    }

    makeRequest();
  }, [search]);

  async function addSubscription(login_of_following: string) {
    if (account && token) {
      await postSubscriptionOnFollowerOrFollowing(account.login, path, login_of_following, token);
      const updatedAccountsArr = searchAccounts.map(item => {
        if (item.login === login_of_following) {
          item.follow_account = true;
          return item;
        } else {
          return item;
        }
      });
      setSearchAccounts(updatedAccountsArr);
      addFollowing(login_of_following);
      // чтобы были отображены изменения на нашей странице
      if (account.login === user?.login) {
        increaseFollowingsCount();
      }
    }
  }

  async function removeFollowerOrSubscription(login_of_following: string) {
    // проверка, требуемая типизацией
    if (account?.login && token) {
      await deleteFollowerOrSubscription(account.login, path, login_of_following, token);
      let updatedAccountsArr;
      if (account.login === user?.login) {
        updatedAccountsArr = searchAccounts.filter(item => item.login !== login_of_following);
      } else {
        updatedAccountsArr = searchAccounts.map(item => {
          if (item.login === login_of_following) {
            item.follow_account = false;
            return item;
          } else {
            return item;
          }
        });
      }
      setSearchAccounts(updatedAccountsArr);
      deleteFollowing(login_of_following);
      // чтобы были отображены изменения на нашей странице
      if (account.login === user?.login) {
        if (path === "followers") {
          decreaseFollowersCount();
        } else {
          decreaseFollowingsCount();
        }
      }
    }
  }

  return (
    <div
      className={style.modalContainer}
      onClick={() => {
        handleModalClose();
      }}
    >
      <div
        className={style.modal}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className={style.header}>
          <div style={{ width: "27px" }}></div>
          <div style={{ fontWeight: "500" }}>
            {path === "followers" ? "Подписчики" : "Подписки"}
          </div>
          <CloseOutlinedIcon
            sx={{ fontSize: "28px", cursor: "pointer" }}
            onClick={() => {
              handleModalClose();
            }}
          />
        </div>
        <div className={style.searchContainer}>
          <SearchInput />
        </div>
        <div className={style.accountsContainer}>
          {searchAccounts.length > 0 ? (
            searchAccounts.map((el, i) => (
              <div key={`accountId-${i}`} className={style.accountContainer}>
                <SearchUser searchUser={el} addSubscription={addSubscription} />
                {account?.login === user?.login ? (
                  path === "followers" ? (
                    <div
                      className={`${style.button} ${style.deleteButton}`}
                      onClick={() => {
                        removeFollowerOrSubscription(el.login);
                      }}
                    >
                      Удалить
                    </div>
                  ) : (
                    // будет при path === "followings"
                    <div
                      className={`${style.button} ${style.deleteButton}`}
                      onClick={() => {
                        removeFollowerOrSubscription(el.login);
                      }}
                    >
                      Отменить
                    </div>
                  )
                ) : el.login === user?.login ? (
                  <div></div>
                ) : !el.follow_account ? (
                  <div
                    className={`${style.button} ${style.subscribeButton}`}
                    onClick={() => {
                      addSubscription(el.login);
                    }}
                  >
                    Подписаться
                  </div>
                ) : (
                  <div
                    className={`${style.button} ${style.deleteButton}`}
                    onClick={() => {
                      removeFollowerOrSubscription(el.login);
                    }}
                  >
                    Отменить
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={style.textNothingFound}>Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersAndFollowingsModalWindow;
