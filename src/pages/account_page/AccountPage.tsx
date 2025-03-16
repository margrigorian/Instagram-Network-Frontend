import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import AccountUserInfo from "../../components/account_user_info/AccountUserInfo";
import FollowersAndFollowingsModalWindow from "../../components/followers_and_followings_modal_window/FollowersAndFollowingsModalWindow";
import PostModalWindow from "../../components/post_modal_window/PostModalWindow";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { postStore } from "../../store/postStore";
import { searchStore } from "../../store/searchStore";
import { getAccountInfoWithSearchAccounts } from "../../lib/requests/accountRequests";
import style from "./AccountPage.module.css";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import * as Icon from "react-bootstrap-icons";
import PostDisplay from "../../components/post_display/PostDisplay";

const AccountPage: React.FC = () => {
  const { login } = useParams();
  const user = userStore(state => state.user);
  const account = accountStore(state => state.user);
  const setUser = accountStore(state => state.setUser);
  const setFollowersCount = accountStore(state => state.setFollowersCount);
  const setFollowingsCount = accountStore(state => state.setFollowingsCount);
  const posts = postStore(state => state.posts);
  const setPosts = postStore(state => state.setPosts);
  const search = searchStore(state => state.search);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const isOpenedPostModalWindow = postStore(state => state.isOpenedPostModalWindow);
  const isOpenedFollowersAndFollowingsModalWindow = accountStore(
    state => state.isOpenedFollowersAndFollowingsModalWindow
  );
  const setIsOpenedFollowersAndFollowingsModalWindow = accountStore(
    state => state.setIsOpenedFollowersAndFollowingsModalWindow
  );
  const isOpenedAuthorizationWarningModalWindow = accountStore(
    state => state.isOpenedAuthorizationWarningModalWindow
  );
  const setIsOpenedAuthorizationWarningModalWindow = accountStore(
    state => state.setIsOpenedAuthorizationWarningModalWindow
  );

  const [loading, setLoading] = useState(true);
  const reloudAccountPage = accountStore(state => state.reloudAccountPage);

  const handleFollowersAndFollowingsModalOpen = (path: string): void => {
    window.history.pushState({}, "", `/accounts/${account?.login}/${path}`);
    setIsOpenedFollowersAndFollowingsModalWindow(true);
  };

  // информация, необходимая для регулирования очистки searchAccounts
  const url: string = window.location.pathname;
  const urlArr = url.split("/");
  const path = urlArr[urlArr.length - 1];

  useEffect(() => {
    async function makeRequest() {
      if (login) {
        const accountInfoWithSearchAccounts = await getAccountInfoWithSearchAccounts(login, search);
        if (search) {
          // проверка, требуемая типизацией
          if (accountInfoWithSearchAccounts?.data?.searchAccounts) {
            setSearchAccounts(accountInfoWithSearchAccounts.data.searchAccounts);
          }
        } else {
          // есть результаты, закрываем loading
          setLoading(false);
          // при этом, если вынести loading в store, возникает бесконечный цикл
          // страница безостановочно будет перезагружается

          if (path !== "followers" && path !== "following") {
            setSearchAccounts([]);
          }

          if (accountInfoWithSearchAccounts?.data?.accountInfo) {
            setUser(accountInfoWithSearchAccounts.data.accountInfo.user);
            setFollowersCount(accountInfoWithSearchAccounts.data.accountInfo.followers_count);
            setFollowingsCount(accountInfoWithSearchAccounts.data.accountInfo.followings_count);
            if (accountInfoWithSearchAccounts.data.accountInfo.posts) {
              setPosts(accountInfoWithSearchAccounts.data.accountInfo.posts);
            }
          } else {
            // аккаунт не найден, обнуляем, чтобы старое не сохранялось
            setUser(null);
            setFollowersCount(0);
            setFollowingsCount(0);
            setPosts([]);
          }
        }
      }
    }

    makeRequest();
  }, [search, reloudAccountPage]);

  return (
    <div>
      {user ? <NavBar /> : undefined}
      {/* Сработает при отсутствии авторизации */}
      {isOpenedAuthorizationWarningModalWindow && (
        <div
          className={style.containerOfAuthorizationWarningModalWindow}
          onClick={() => {
            setIsOpenedAuthorizationWarningModalWindow(false);
          }}
        >
          <div
            className={style.authorizationWarningModalWindow}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            Пройдите &nbsp;
            <NavLink
              to={"/"}
              className={style.authorizationButton}
              onClick={() => {
                setIsOpenedAuthorizationWarningModalWindow(false);
              }}
            >
              авторизацию
            </NavLink>{" "}
          </div>
        </div>
      )}
      {isOpenedFollowersAndFollowingsModalWindow && <FollowersAndFollowingsModalWindow />}
      {isOpenedPostModalWindow && <PostModalWindow posts={posts} />}
      {/* header при неавторизации */}
      {!user ? (
        <div className={style.headerContainer}>
          <div className={style.headerWithoutLogin}>
            <NavLink to={"/"} className={style.instagramLogo}></NavLink>
            <div className={style.loginContainer}>
              <NavLink to={"/"}>
                <button className={style.blueButton}>Войти</button>
              </NavLink>
              <NavLink to={"/register"} className={style.registerLink}>
                Зарегистрироваться
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div
        style={user ? { marginLeft: "258px" } : { margin: "0 auto" }}
        className={style.container}
      >
        {loading ? (
          <div className={style.loading}></div>
        ) : account ? (
          <div>
            <AccountUserInfo
              handleFollowersAndFollowingsModalOpen={handleFollowersAndFollowingsModalOpen}
            />

            <div className={style.highlightsContainer}>
              <div className={style.highlightsCircle}>
                <div className={style.highlightsPlusContainer}>
                  <Icon.PlusLg className={style.plusIcon} />
                </div>
              </div>
              <div className={style.addText}>Добавить</div>
            </div>

            <div className={style.postsNavBarContainer}>
              <div className={style.postsNavBarItemContainer}>
                <GridOnOutlinedIcon sx={{ fontSize: "13px" }} className={style.gridNavBarIcon} />
                <div className={style.postsNavBarTitle}>ПУБЛИКАЦИИ</div>
              </div>
              {user?.login === account.login ? (
                <div className={style.savedNavBarItemContainer}>
                  <BookmarkBorderOutlinedIcon
                    sx={{ fontSize: "16px" }}
                    className={style.bookMarkNavBarIcon}
                  />
                  <div>СОХРАНЕННОЕ</div>
                </div>
              ) : undefined}
              <div className={style.marksNavBarItemContainer}>
                <Icon.PersonBoundingBox size={"13px"} className={style.userNavBarIcon} />
                <div>ОТМЕТКИ</div>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className={style.postsContainer}>
                {posts.map((el, i) => (
                  <PostDisplay key={`postsId-${el.id}`} post={el} indexOfCurrentPost={i} />
                ))}
              </div>
            ) : (
              <div className={style.noPostsContainer}>
                <div className={style.cameraIconCircle}>
                  <Icon.Camera />
                </div>
                <div className={style.noPostsText}>Публикаций пока нет</div>
              </div>
            )}
          </div>
        ) : (
          <div className={style.unavailablePageContainer}>
            <div className={style.unavailablePageText}>К сожалению, эта страница недоступна</div>
            <div>
              Возможно, вы воспользовались недействительной ссылкой или страница была удалена.{" "}
              <NavLink to={"/home"} className={style.backToInstagramLink}>
                Назад в Instagram
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
