import React, { useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import PostOfHomePage from "../../components/post_of_home_page/PostOfHomePage";
import PostModalWindow from "../../components/post_modal_window/PostModalWindow";
import { userStore } from "../../store/userStore";
import { postStore } from "../../store/postStore";
import { searchStore } from "../../store/searchStore";
import {
  addLikeToPostOrFollowAccountFromHomePage,
  deleteLikeFromPostOrUnfollowAccountFromHomePage,
  getPostsWithRecommendationsAndSearchAccounts
} from "../../lib/requests/postsRequests";
import style from "./HomePage.module.css";
import ListedAccount from "../../components/listed_account/ListedAccount";

const HomePage: React.FC = () => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const posts = postStore(state => state.posts);
  const setPosts = postStore(state => state.setPosts);
  const recommendedAccounts = searchStore(state => state.recommendedAccounts);
  const setRecommendedAccounts = searchStore(state => state.setRecommendedAccounts);
  const setSubscriptionStatusOfRecommendedAccount = searchStore(
    state => state.setSubscriptionStatusOfRecommendedAccount
  );
  const addFollowing = userStore(state => state.addFollowing);
  const deleteFollowing = userStore(state => state.deleteFollowing);
  const search = searchStore(state => state.search);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const isOpenedPostModalWindow = postStore(state => state.isOpenedPostModalWindow);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function makeRequest() {
      if (token) {
        const postsWithRecommendationsAndSearchAccounts =
          await getPostsWithRecommendationsAndSearchAccounts(token, search);
        if (search) {
          if (postsWithRecommendationsAndSearchAccounts?.data?.searchAccounts) {
            setSearchAccounts(postsWithRecommendationsAndSearchAccounts.data.searchAccounts);
          }
        } else {
          // есть результаты, закрываем loading
          setLoading(false);

          if (postsWithRecommendationsAndSearchAccounts?.data) {
            setPosts(postsWithRecommendationsAndSearchAccounts.data.posts);
            setRecommendedAccounts(
              postsWithRecommendationsAndSearchAccounts.data.recommendedAccounts
            );
          }
        }
      }
    }

    makeRequest();
  }, [search]);

  // смена url при открытии модального окна поста
  const handlePostModalOpen = (postId: string, lengthOfImagesArray: number): void => {
    const postUrl = lengthOfImagesArray > 1 ? `/p/${postId}/?img_index=1` : `/p/${postId}/`; // Новый URL
    window.history.pushState({}, "", postUrl);
    setIsOpenedPostModalWindow(true);
  };

  async function addSubscriptionOnAccount(login_of_following: string) {
    // проверка, требуемая типизацией
    if (token) {
      await addLikeToPostOrFollowAccountFromHomePage(
        "login_of_following",
        login_of_following,
        token
      );
      addFollowing(login_of_following);
      setSubscriptionStatusOfRecommendedAccount(login_of_following, true);
    }
  }

  async function removeSubscriptionOnAccount(login_of_following: string) {
    // проверка, требуемая типизацией
    if (token) {
      deleteLikeFromPostOrUnfollowAccountFromHomePage(
        "login_of_following",
        login_of_following,
        token
      );
      deleteFollowing(login_of_following);
      setSubscriptionStatusOfRecommendedAccount(login_of_following, false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <NavBar />
      {/* Без регистрации будет перенаправление на страницу login */}
      {user ? (
        <div className={style.container}>
          <div className={style.postsContainer}>
            {loading ? (
              <div className={style.loading}></div>
            ) : posts.length > 0 ? (
              posts.map((el, i) => (
                <div
                  key={`postId-${el.id}`}
                  style={i !== 0 ? { marginTop: "30px" } : undefined}
                  className={style.postContainer}
                >
                  <PostOfHomePage post={el} handlePostModalOpen={handlePostModalOpen} />
                </div>
              ))
            ) : (
              <div className={style.containerWithoutPosts}>
                <div>Подписывайтесь и следите за актуальными публикациями</div>
                <div className={style.instagramAccountIcon}></div>
              </div>
            )}
          </div>
          <div className={style.recommendationsContainer}>
            <div className={style.accountContainer}>
              <ListedAccount
                listedAccount={{
                  login: user.login,
                  username: user.username,
                  avatar: user.avatar,
                  verification: user.verification
                }}
              />
              <NavLink to="/" className={style.blueButton}>
                Переключиться
              </NavLink>
            </div>

            {/* РЕКОМЕНДАЦИИ */}
            {loading ? (
              <div className={style.loading}></div>
            ) : recommendedAccounts.length > 0 ? (
              <div>
                <div className={style.recommendationText}>Рекомендации для вас</div>
                {recommendedAccounts.map((account, i) => (
                  <div key={`recommendedAccountId-${i}`} className={style.accountContainer}>
                    <ListedAccount
                      listedAccount={{
                        login: account.login,
                        followers: account.followers
                          ? `Подписаны ${account.followers}`
                          : "Рекомендация",
                        avatar: account.avatar,
                        verification: account.verification
                      }}
                    />
                    {account.follow_account ? (
                      <div
                        className={style.unfollowButton}
                        onClick={() => {
                          removeSubscriptionOnAccount(account.login);
                        }}
                      >
                        Подписка
                      </div>
                    ) : (
                      <div
                        className={style.blueButton}
                        onClick={() => {
                          addSubscriptionOnAccount(account.login);
                        }}
                      >
                        Подписаться
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className={style.recommendationText}>Рекомендаций пока нет</div>
                <div className={style.listIcon}></div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Navigate to="/" replace />
      )}

      {isOpenedPostModalWindow && <PostModalWindow posts={posts} />}
    </div>
  );
};

export default HomePage;
