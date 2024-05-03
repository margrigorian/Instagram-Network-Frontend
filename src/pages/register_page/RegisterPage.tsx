import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../lib/request";
import { makeRegistration } from "../../lib/request";
import { userStore } from "../../store/store";
import { IRegistartionFormData } from "../../lib/types/formDataTypes";
import style from "./RegisterPage.module.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme/theme";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FacebookIcon from "@mui/icons-material/Facebook";
import * as Icon from "react-bootstrap-icons";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = userStore(state => state.setUser);
  const setToken = userStore(state => state.setToken);

  const {
    register, // метод формы, который возвращает объект, поэтому деструкт. в самой форме
    formState: { errors }, // содержит разные св-ва
    handleSubmit, // функия-обертка над нашим кастомным хэндлером - onSubmit, в случае ошибки не допустит отправку данных
    reset
  } = useForm<IRegistartionFormData>({
    mode: "onBlur" // настройка режима: если убрать фокус с инпут, при ошибке сразу высветится коммент error
  });

  const onSubmit: SubmitHandler<IRegistartionFormData> = async data => {
    const serverAnswer = await makeRegistration(data);
    // при ошибке на сервере будет undefined, нужна проверка
    if (serverAnswer?.data?.user) {
      setUser(serverAnswer.data.user);
      setToken(serverAnswer.data.token);
    }

    // очищаем inputs
    // возможно не имеет смысла, так как происходит переход на другую страницу
    setContact("");
    setUsername("");
    setLogin("");
    setPassword("");
    reset();
    navigate("/home");
  };

  // для контроля icon в input
  const [isFocusedOnContact, setIsFocusedOnContact] = useState(false);
  const [isFocusedOnUsername, setIsFocusedOnUsername] = useState(false);
  const [isFocusedOnLogin, setIsFocusedOnLogin] = useState(false);
  const handleBlur = () => {
    setIsFocusedOnContact(false);
    setIsFocusedOnUsername(false);
    setIsFocusedOnLogin(false);
  };
  const [contact, setContact] = useState("");
  const pattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/ ||
    /^(\+?\d{1,3})?[- .]?\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4}(?:\s*\(\d{1,5}\))?$/;
  // можно и errors исп. для контроля иконок в инпут
  const [isValidContact, setIsValidContact] = useState(true);
  const handleContactValidation = (e: HTMLInputElement) => {
    const reg = new RegExp(pattern);
    setIsValidContact(reg.test(e.value));
  };
  const [username, setUsername] = useState("");
  const [login, setLogin] = useState("");
  const [isExistingLoginInDb, setIsExistingLoginInDb] = useState(false);
  // проверка занят ли логин уже
  async function checkLoginInDb(login: string): Promise<void> {
    const result = await checkLogin(login);

    if (result?.data?.login) {
      setIsExistingLoginInDb(true);
    } else {
      setIsExistingLoginInDb(false);
    }
  }
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className={style.container}>
      <div className={style.registerContainer}>
        <div className={style.instagramLogoContainer}>
          <div className={style.instagramLogo}></div>
        </div>

        <div className={style.registerText}>
          Зарегистрируйтесь, чтобы смотреть фото и видео ваших друзей
        </div>

        <button className={style.facebookButton}>
          <FacebookIcon sx={{ marginRight: "5px", fontSize: "22px" }} />
          Войти через Facebook
        </button>

        <div className={style.orContainer}>
          <div className={style.horizontalLine}></div>
          <div className={style.orWord}>ИЛИ</div>
          <div className={style.horizontalLine}></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <ThemeProvider theme={theme}>
            <div className={style.inputContainer}>
              <TextField
                id="contact"
                {...register("contact", {
                  value: contact,
                  // прописываем required и паттерн, чтобы при ошибке не отправлялась форма
                  required: "error",
                  pattern: {
                    value: pattern,
                    message: "Please enter a valid contact" // сообщение ошибки обязательно
                  },
                  // убираем фокус, появляется иконка
                  onBlur: handleBlur
                  // метода onFocus нет
                })}
                label="Моб. телефон или эл. адрес"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!isFocusedOnContact && contact ? (
                        // !errors.contact при повторной регистриации не срабатет, хотя это и не нужно
                        isValidContact ? (
                          <Icon.CheckCircle size={20} color={"#bfbfbf"} />
                        ) : (
                          <Icon.XCircle size={20} color={"red"} />
                        )
                      ) : (
                        ""
                      )}
                    </InputAdornment>
                  )
                }}
                // контроль error icon
                onChange={e => {
                  const emailOrPhoneNumber = e.target as HTMLInputElement;
                  // ставим фокус, иконка исчезает
                  setIsFocusedOnContact(true);
                  setContact(emailOrPhoneNumber.value);
                  handleContactValidation(emailOrPhoneNumber);
                }}
              />
            </div>

            <div className={style.inputContainer}>
              <TextField
                id="username"
                {...register("username", {
                  value: username,
                  onBlur: handleBlur
                })}
                // возвращание label в состояние placeholder зависит от способа ввода данных
                label="Имя и фамилия"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!isFocusedOnUsername && username ? (
                        <Icon.CheckCircle size={20} color={"#bfbfbf"} />
                      ) : (
                        ""
                      )}
                    </InputAdornment>
                  )
                }}
                onChange={e => {
                  setUsername(e.target.value);
                  setIsFocusedOnUsername(true);
                }}
              />
            </div>

            <div className={style.inputContainer}>
              <TextField
                id="login"
                {...register("login", {
                  value: login,
                  required: "error",
                  onBlur: handleBlur
                })}
                label="Имя пользователя"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!isFocusedOnLogin && login ? (
                        !isExistingLoginInDb ? (
                          <Icon.CheckCircle size={20} color={"#bfbfbf"} />
                        ) : (
                          <Icon.XCircle size={20} color={"red"} />
                        )
                      ) : (
                        ""
                      )}
                    </InputAdornment>
                  )
                }}
                onChange={e => {
                  setLogin(e.target.value);
                  setIsFocusedOnLogin(true);
                  if (e.target.value) {
                    // чтобы не отправлялся "", параметр обязателен, иначе меняется путь - см. backend
                    checkLoginInDb(e.target.value);
                  }
                }}
              />
            </div>
            <div className={style.inputContainer}>
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  value: password,
                  required: "error",
                  minLength: {
                    value: 5,
                    message: "Minimum of 5 characters"
                  }
                })}
                label="Пароль"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {password ? (
                        <div className={style.passwordIconsContainer}>
                          {!errors.password ? (
                            <Icon.CheckCircle size={20} color={"#bfbfbf"} />
                          ) : (
                            <Icon.XCircle size={20} color={"red"} />
                          )}
                          <div
                            onClick={handleClickShowPassword}
                            className={style.showPasswordButton}
                          >
                            {showPassword ? "Скрыть" : "Показать"}
                          </div>
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

          <div className={style.policyText}>
            Регистрируясь, вы принимаете наши{" "}
            <span className={style.spanOfPolicyText}>Условия</span>,{" "}
            <span className={style.spanOfPolicyText}>Политику конфиденциальности</span> и{" "}
            <span className={style.spanOfPolicyText}>Политику в отношении файлов cookie</span>
          </div>

          <button
            type="submit"
            // иначе сбивается errors при редактировании данных и соответственно сбивается css
            disabled={isExistingLoginInDb || Object.keys(errors).length > 0 ? true : false}
            className={style.registerButton}
          >
            Регистрация
          </button>

          {isExistingLoginInDb && (
            <div className={style.alertTextContainer}>
              <div className={style.alertText}>Это имя пользователя уже занято</div>
              <div className={style.alertText}>Попробуйте другое</div>
            </div>
          )}
        </form>
      </div>

      <div className={style.loginTextContainer}>
        Есть аккаунт?
        <NavLink to="/" className={style.loginNavlink}>
          <span className={style.spanOfLoginText}> Вход</span>
        </NavLink>
      </div>
    </div>
  );
};

export default RegisterPage;
