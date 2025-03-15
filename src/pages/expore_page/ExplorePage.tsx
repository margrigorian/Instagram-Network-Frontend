import React, { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import PostDisplay from "../../components/post_display/PostDisplay";
import PostModalWindow from "../../components/post_modal_window/PostModalWindow";
import { userStore } from "../../store/userStore";
import { postStore } from "../../store/postStore";
import { searchStore } from "../../store/searchStore";
import { getExploredPostsWithSearchAccounts } from "../../lib/requests/postsRequests";
import style from "./ExplorePage.module.css";
import * as Icon from "react-bootstrap-icons";

const ExplorePage: React.FC = () => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const search = searchStore(state => state.search);
  const posts = postStore(state => state.posts);
  const setPosts = postStore(state => state.setPosts);
  const searchAccounts = searchStore(state => state.searchAccounts);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const isOpenedPostModalWindow = postStore(state => state.isOpenedPostModalWindow);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    async function makeRequest() {
      if (token) {
        const exploredPostsWithSearchAccounts = await getExploredPostsWithSearchAccounts(
          keyword,
          search,
          token
        );

        if (search) {
          // проверка, требуемая типизацией
          if (exploredPostsWithSearchAccounts?.data?.searchAccounts) {
            setSearchAccounts(exploredPostsWithSearchAccounts.data.searchAccounts);
          }
        } else {
          // очищаем поиск
          if (searchAccounts.length > 0) {
            setSearchAccounts([]);
          }

          if (exploredPostsWithSearchAccounts?.data?.exploredPosts) {
            setPosts(exploredPostsWithSearchAccounts.data.exploredPosts);
          }
        }
      }
    }

    makeRequest();
  }, [search, keyword]);

  return (
    <div>
      {/* Без регистрации будет перенаправление на страницу login */}
      {user ? (
        <div>
          <NavBar />
          <div className={style.container}>
            {keyword && <div className={style.keyword}>#{keyword}</div>}
            {posts.length > 0 ? (
              <div className={style.postContainer}>
                {posts.map((el, i) => (
                  <PostDisplay key={`postsId-${el.id}`} post={el} indexOfCurrentPost={i} />
                ))}
              </div>
            ) : (
              <div className={style.noResultContainer}>
                <div className={style.searchIconContainer}>
                  <Icon.Search style={{ fontSize: "34px" }} />
                </div>
                <div className={style.noResultText}>По запросу ничего не найдено</div>
              </div>
            )}
          </div>
          {isOpenedPostModalWindow && <PostModalWindow posts={posts} />}
        </div>
      ) : (
        <Navigate to="/" replace />
      )}
    </div>
  );
};

export default ExplorePage;
