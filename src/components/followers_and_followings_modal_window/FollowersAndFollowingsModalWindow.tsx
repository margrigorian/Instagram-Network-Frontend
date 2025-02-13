import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import {
  getAccounts,
  postSubscriptionOnFollowerOrFollowing,
  deleteFollowerOrSubscription
} from "../../lib/requests/accountRequests";
import { IFollowerOrFollowing } from "../../store/types/accountStoreTypes";
import style from "./FollowersAndFollowingsModalWindow.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import * as Icon from "react-bootstrap-icons";

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
  const setReloudAccountPage = accountStore(state => state.setReloudAccountPage);

  const navigate = useNavigate();
  function handleModalClose() {
    navigate(-1);
    setIsOpenedFollowersAndFollowingsModalWindow(false);
  }

  const url: string = window.location.pathname;
  const urlArr = url.split("/");
  const path = urlArr[urlArr.length - 1];
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState<IFollowerOrFollowing[]>([]);

  useEffect(() => {
    async function makeRequest() {
      // проверка, требуемая типизацией
      if (account && token) {
        const requestedAccounts = await getAccounts(account.login, path, search, token);
        if (requestedAccounts) {
          setAccounts(requestedAccounts);
        }
      }
    }

    makeRequest();
  }, [search]);

  async function addSubscription(login_of_following: string) {
    if (account && token) {
      await postSubscriptionOnFollowerOrFollowing(account.login, path, login_of_following, token);
      const updatedAccountsArr = accounts.map(item => {
        if (item.login === login_of_following) {
          item.follow_account = true;
          return item;
        } else {
          return item;
        }
      });
      setAccounts(updatedAccountsArr);
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
        updatedAccountsArr = accounts.filter(item => item.login !== login_of_following);
      } else {
        updatedAccountsArr = accounts.map(item => {
          if (item.login === login_of_following) {
            item.follow_account = false;
            return item;
          } else {
            return item;
          }
        });
      }
      setAccounts(updatedAccountsArr);
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
          <div style={{ fontWeight: "500" }}>Подписчики</div>
          <CloseOutlinedIcon
            sx={{ fontSize: "28px", cursor: "pointer" }}
            onClick={() => {
              handleModalClose();
            }}
          />
        </div>
        <div className={style.searchContainer}>
          <div className={style.searchInputContainer}>
            <Icon.Search style={{ color: "grey" }} />
            <input
              placeholder="Поиск"
              className={style.searchInput}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
              }}
            />
            {search ? (
              <Icon.XCircleFill
                style={{ fontSize: "14px", cursor: "pointer" }}
                onClick={() => {
                  setSearch("");
                }}
              />
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className={style.accountsContainer}>
          {accounts.length > 0 ? (
            accounts.map((el, i) => (
              <div key={`accountId-${i}`} className={style.accountContainer}>
                <div className={style.account}>
                  <NavLink
                    to={`/accounts/${el.login}`}
                    onClick={() => {
                      // чтобы перезагрузилась страница и выполнился request по новому юзеру
                      setReloudAccountPage();
                      setIsOpenedFollowersAndFollowingsModalWindow(false);
                    }}
                  >
                    {el.avatar ? (
                      <img src={el.avatar} className={style.avatarIcon} />
                    ) : (
                      <Icon.PersonCircle className={style.defaultAvatar} />
                    )}
                  </NavLink>
                  <div className={style.accountInfoContainer}>
                    <div className={style.loginContainer}>
                      <NavLink
                        to={`/accounts/${el.login}`}
                        onClick={() => {
                          // чтобы перезагрузилась страница и выполнился request по новому юзеру
                          setReloudAccountPage();
                          setIsOpenedFollowersAndFollowingsModalWindow(false);
                        }}
                        className={style.login}
                      >
                        {el.login}
                      </NavLink>
                      {el.verification ? <div className={style.verificationIcon}></div> : ""}
                      {account?.login === user?.login && !el?.follow_account && (
                        <div className={style.subscriptionContainer}>
                          <Icon.Dot style={{ fontSize: "8px" }} />
                          <div
                            className={style.subscriptionButton}
                            onClick={() => {
                              addSubscription(el.login);
                            }}
                          >
                            Подписаться
                          </div>
                        </div>
                      )}
                    </div>
                    {el.username ? <div className={style.username}>{el.username}</div> : ""}
                  </div>
                </div>
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
