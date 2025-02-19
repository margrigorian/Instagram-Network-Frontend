import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import { userStore } from "../../store/userStore";
import style from "./HomepAge.module.css";

const HomePage: React.FC = () => {
  const user = userStore(state => state.user);

  return (
    <div>
      <NavBar />
      {/* Без регистрации будет перенаправление на страницу login */}
      {user ? "" : <Navigate to="/" replace />}
    </div>
  );
};

export default HomePage;
