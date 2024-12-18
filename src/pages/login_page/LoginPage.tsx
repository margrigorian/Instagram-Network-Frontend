import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/store";
import { makeAuthorization } from "../../lib/request";
import { ILoginFormData } from "../../lib/types/formDataTypes";
import style from "./LoginPage.module.css";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import { textFieldTheme } from "../../theme/theme";
import TextField from "@mui/material/TextField";
import FacebookIcon from "@mui/icons-material/Facebook";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = userStore(state => state.setUser);
  const setFollowers = userStore(state => state.setFollowers);
  const setFollowing = userStore(state => state.setFollowing);
  const setToken = userStore(state => state.setToken);
  const [isExistingError, setIsExistingError] = useState(false);

  const {
    register, // метод формы, который возвращает объект, поэтому деструкт. в самой форме
    handleSubmit // функия-обертка над нашим кастомным хэндлером - onSubmit, в случае ошибки не допустит отправку данных
  } = useForm<ILoginFormData>({
    mode: "onBlur" // настройка режима: если убрать фокус с инпут, при ошибке сразу высветится коммент error
  });

  const onSubmit: SubmitHandler<ILoginFormData> = async data => {
    const serverAnswer = await makeAuthorization(data);

    // при ошибке на сервере будет undefined, нужна проверка
    if (serverAnswer?.data?.user) {
      setUser(serverAnswer.data.user);
      setFollowers(serverAnswer.data.followers);
      setFollowing(serverAnswer.data.following);
      setToken(serverAnswer.data.token);
      navigate("/home");
    } else {
      setIsExistingError(true);
    }
  };

  // контроль showPassword
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className={style.container}>
      <div className={style.phoneScreenImage}></div>
      <div className={style.authenticationContainer}>
        <div className={style.loginContainer}>
          <div className={style.instagramLogoContainer}>
            <div className={style.instagramLogo}></div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
            <ThemeProvider theme={textFieldTheme}>
              <div className={style.inputContainer}>
                <TextField
                  id="login"
                  label="Телефон, имя пользователя или эл. адрес"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register("login", {
                    required: "error"
                  })}
                />
              </div>

              <div className={style.inputContainer}>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Пароль"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register("password", {})}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {password ? (
                          <div
                            onClick={handleClickShowPassword}
                            className={style.showPasswordButton}
                          >
                            {showPassword ? "Скрыть" : "Показать"}
                          </div>
                        ) : (
                          ""
                        )}
                      </InputAdornment>
                    )
                  }}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </ThemeProvider>

            <button type="submit" className={style.button}>
              Войти
            </button>
          </form>

          <div className={style.orContainer}>
            <div className={style.horizontalLine}></div>
            <div className={style.orWord}>ИЛИ</div>
            <div className={style.horizontalLine}></div>
          </div>

          <div className={style.facebookContainer}>
            <FacebookIcon sx={{ marginRight: "5px", fontSize: "22px" }} />
            Войти через Facebook
          </div>
          {isExistingError && (
            <div className={style.alertText}>
              Вы ввели неверный пароль. Проверьте пароль и попробуйте ещё раз
            </div>
          )}
          <div className={style.forgotPasswordText}>Забыли пароль?</div>
        </div>

        <div className={style.registerTextContainer}>
          У вас ещё нет аккаунта?
          <NavLink to="/register" className={style.registerNavlink}>
            <span className={style.spanText}> Зарегистрироваться</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
