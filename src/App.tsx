import style from "./App.module.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userStore } from "./store/store";
import ScrollToTop from "./hoc/ScrollToTheTop";
// import NavBar from "./components/navbar/NavBar";
import LoginPage from "./pages/login_page/LoginPage";
import RegisterPage from "./pages/register_page/RegisterPage";
import HomePage from "./pages/home_page/HomePage";
import AccountPage from "./pages/account_page/AccountPage";
import EditProfilePage from "./pages/edit_profile_page/EditProfilePage";

const App: React.FC = () => {
  const user = userStore(state => state.user);

  return (
    <div className={user ? style.App : undefined}>
      <BrowserRouter>
        <ScrollToTop />
        {/* При возврате назад виден на странице login, register. Приходится везде дублировать */}
        {/* {user ? <NavBar /> : undefined} */}
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
