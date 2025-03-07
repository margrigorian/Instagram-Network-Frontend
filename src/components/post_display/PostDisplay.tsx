import React from "react";
import { userStore } from "../../store/userStore";
import { accountStore } from "../../store/accountStore";
import { postStore } from "../../store/postStore";
import { IPost } from "../../store/types/postStoreTypes";
import copyImage from "../../pictures/copy.png";
import style from "./PostDisplay.module.css";
import * as Icon from "react-bootstrap-icons";

interface IPostProps {
  post: IPost;
  indexOfCurrentPost: number;
}

const PostDisplay: React.FC<IPostProps> = ({ post, indexOfCurrentPost }) => {
  const user = userStore(state => state.user);
  const setIsOpenedPostModalWindow = postStore(state => state.setIsOpenedPostModalWindow);
  const setIndexOfCurrentPost = postStore(state => state.setIndexOfCurrentPost);
  const setIsOpenedAuthorizationWarningModalWindow = accountStore(
    state => state.setIsOpenedAuthorizationWarningModalWindow
  );

  // делает переключение на другую страницу (почему?), не подходит
  // const navigate = useNavigate();
  // const handleModalOpen = () => {
  //   navigate("/my-modal", { replace: true });
  //   setIsOpenedPostModalWindow();
  // };

  // смена url при открытии модального окна поста
  const handlePostModalOpen = (postId: string, lengthOfImagesArray: number): void => {
    const postUrl = lengthOfImagesArray > 1 ? `/p/${postId}/?img_index=1` : `/p/${postId}/`; // Новый URL
    window.history.pushState({}, "", postUrl);
    setIsOpenedPostModalWindow(true);
  };

  return (
    <div
      style={{ backgroundImage: `url(${post.images[0].image})` }}
      className={style.post}
      onClick={() => {
        if (user) {
          setIndexOfCurrentPost(indexOfCurrentPost);
          handlePostModalOpen(post.id, post.images.length);
        } else {
          setIsOpenedAuthorizationWarningModalWindow(true);
        }
      }}
    >
      <div className={style.postsDisplay}>
        {post.images.length > 1 ? <img src={copyImage} className={style.collectionIcon} /> : ""}
        <div className={style.evaluationDisplay}>
          <div
            style={post.images.length > 1 ? { paddingTop: "33%" } : { paddingTop: "45%" }}
            className={style.evaluationContainer}
          >
            <div className={style.likesNumberContainer}>
              <Icon.HeartFill size={"18px"} />
              {post.likes.length}
            </div>
            <div className={style.commentsNumberContainer}>
              <Icon.ChatFill size={"18px"} />
              {post.comments_number}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDisplay;
