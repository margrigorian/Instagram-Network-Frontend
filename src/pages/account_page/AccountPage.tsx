import React, { useEffect } from "react";
import style from "./AccountPage.module.css";
import { NavLink, useParams } from "react-router-dom";
import { getAccountInfo } from "../../lib/request";
import { userStore, accountStore } from "../../store/store";
import NavBar from "../../components/navbar/NavBar";
import AccountUserInfo from "../../components/account_user_info/AccountUserInfo";
import * as Icon from "react-bootstrap-icons";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import copyImage from "../../pictures/copy.png";

const AccountPage: React.FC = () => {
  const user = userStore(state => state.user);
  const { login } = useParams();
  const account = accountStore(state => state.user);
  const posts = accountStore(state => state.posts);
  const setUser = accountStore(state => state.setUser);
  const setFollowers = accountStore(state => state.setFollowers);
  const setFollowing = accountStore(state => state.setFollowing);
  const setPosts = accountStore(state => state.setPosts);

  useEffect(() => {
    async function makeRequest() {
      const account = await getAccountInfo(login);

      if (account?.data) {
        setUser(account.data.user);
        setFollowers(account.data.followers);
        setFollowing(account.data.following);
        setPosts(account.data.posts);
      } else {
        // аккаунт не найден, обнуляем, чтобы старое не сохранялось
        setUser(null);
        setFollowers([]);
        setFollowing([]);
        setPosts([]);
      }
    }

    makeRequest();
  }, []);

  return (
    <div>
      {user ? <NavBar /> : undefined}
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
        {account ? (
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
                {posts.map(el => (
                  <div
                    key={`postsId-${el.id}`}
                    style={{ backgroundImage: `url(${el.images[0].image})` }}
                    className={style.post}
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
                            {el.likes_number}
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
