import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NavBar from "./components/navbar/NavBar";
import SearchDrawer from "./components/search_drawer/SearchDrawer";
import LoginPage from "./pages/login_page/LoginPage";
import RegisterPage from "./pages/register_page/RegisterPage";
import HomePage from "./pages/home_page/HomePage";
import AccountPage from "./pages/account_page/AccountPage";
import EditProfilePage from "./pages/edit_profile_page/EditProfilePage";
import NewPostModalWindow from "./components/new_post_modal_window/NewPostModalWindow";
import { userStore } from "./store/userStore";
import { postStore, storeOfEditedPost } from "./store/postStore";
import ScrollToTop from "./hoc/ScrollToTheTop";
import style from "./App.module.css";

const App: React.FC = () => {
  const user = userStore(state => state.user);
  const isOpenedNewPostModalWindow = storeOfEditedPost(state => state.isOpenedNewPostModalWindow);
  // контроль за скроллом
  const isOpenedPostModalWindow = postStore(state => state.isOpenedPostModalWindow);
  document.body.style.overflow = isOpenedPostModalWindow ? "hidden" : "auto";

  return (
    <div className={user ? style.App : undefined}>
      <BrowserRouter>
        <ScrollToTop />
        <SearchDrawer />
        {/* При возврате назад виден на странице login, register. Приходится везде дублировать */}
        {/* {user ? <NavBar /> : undefined} */}
        {isOpenedNewPostModalWindow && <NewPostModalWindow />}

        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/accounts/:login" element={<AccountPage />}></Route>
          <Route path="/profile/edit" element={<EditProfilePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
