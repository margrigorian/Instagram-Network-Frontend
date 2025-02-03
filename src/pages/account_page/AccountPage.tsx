import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import AccountUserInfo from "../../components/account_user_info/AccountUserInfo";
import PostModalWindow from "../../components/post_modal_window/PostModalWindow";
import { userStore, accountStore, postStore } from "../../store/store";
import { getAccountInfo } from "../../lib/requests/accountRequests";
import style from "./AccountPage.module.css";
import copyImage from "../../pictures/copy.png";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import * as Icon from "react-bootstrap-icons";

const AccountPage: React.FC = () => {
  const { login } = useParams();
  const user = userStore(state => state.user);
  const account = accountStore(state => state.user);
  const setUser = accountStore(state => state.setUser);
  const setFollowersCount = accountStore(state => state.setFollowersCount);
  const setFollowingsCount = accountStore(state => state.setFollowingsCount);
  const posts = accountStore(state => state.posts);
  const setPosts = accountStore(state => state.setPosts);
  const isOpenedPostModalWindow = postStore(state => state.isOpenedPostModalWindow);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setIndexOfCurrentPost = postStore(state => state.setIndexOfCurrentPost);
  const isOpenedAuthorizationWarningModalWindow = accountStore(
    state => state.isOpenedAuthorizationWarningModalWindow
  );
  const setIsOpenedAuthorizationWarningModalWindow = accountStore(
    state => state.setIsOpenedAuthorizationWarningModalWindow
  );

  const [loading, setLoading] = useState(true);
  const reloudAccountPage = accountStore(state => state.reloudAccountPage);

  // делает переключение на другую страницу (почему?), не подходит
  // const navigate = useNavigate();
  // const handleModalOpen = () => {
  //   navigate("/my-modal", { replace: true });
  //   setIsOpenedPostModalWindow();
  // };

  // смена url при открытии модального окна
  const handleModalOpen = (postId: string, lengthOfImagesArray: number): void => {
    const postUrl = lengthOfImagesArray > 1 ? `/p/${postId}/?img_index=1` : `/p/${postId}/`; // Новый URL
    window.history.pushState({}, "", postUrl);
    setIsOpenedPostModalWindow(true);
  };

  useEffect(() => {
    async function makeRequest() {
      const account = await getAccountInfo(login);
      // есть результаты getAccountInfo, закрываем loading
      setLoading(false);
      // при этом, если вынести loading в store, возникает бесконечный цикл
      // страница безостановочно будет перезагружается

      if (account?.data) {
        setUser(account.data.user);
        setFollowersCount(account.data.followers_count);
        setFollowingsCount(account.data.followings_count);
        setPosts(account.data.posts);
      } else {
        // аккаунт не найден, обнуляем, чтобы старое не сохранялось
        setUser(null);
        setFollowersCount(0);
        setFollowingsCount(0);
        setPosts([]);
      }
    }

    makeRequest();
  }, [reloudAccountPage]);

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
      <div style={user ? { marginLeft: "242px" } : {}} className={style.container}>
        {loading ? (
          <div className={style.loading}></div>
        ) : account ? (
          <div>
            <AccountUserInfo />

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
                  <div
                    key={`postsId-${el.id}`}
                    style={{ backgroundImage: `url(${el.images[0].image})` }}
                    className={style.post}
                    onClick={() => {
                      if (user) {
                        setIndexOfCurrentPost(i);
                        handleModalOpen(el.id, el.images.length);
                      } else {
                        setIsOpenedAuthorizationWarningModalWindow(true);
                      }
                    }}
                  >
                    <div className={style.postsDisplay}>
                      {el.images.length > 1 ? (
                        <img src={copyImage} className={style.collectionIcon} />
                      ) : (
                        ""
                      )}
                      <div className={style.evaluationDisplay}>
                        <div
                          style={
                            el.images.length > 1 ? { paddingTop: "33%" } : { paddingTop: "45%" }
                          }
                          className={style.evaluationContainer}
                        >
                          <div className={style.likesNumberContainer}>
                            <Icon.HeartFill size={"18px"} />
                            {el.likes.length}
                          </div>
                          <div className={style.commentsNumberContainer}>
                            <Icon.ChatFill size={"18px"} />
                            {el.comments_number}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
