import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import NavBar from "../../components/navbar/NavBar";
import InboxBlock from "../../components/inbox_block/InboxBlock";
import MessageModalWindow from "../../components/message_modal_window/MessageModalWindow";
import { userStore } from "../../store/userStore";
import { searchStore } from "../../store/searchStore";
import { chatsStore } from "../../store/chatsStore";
import { getChatsWithSearchAccounts } from "../../lib/requests/chatsRequests";
import style from "./InboxPage.module.css";

const InboxPage: React.FC<{ socket: Socket }> = ({ socket }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const search = searchStore(state => state.search);
  const searchAccounts = searchStore(state => state.searchAccounts);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const setInbox = chatsStore(state => state.setInbox);
  const isOpenedMessageModalWindow = chatsStore(state => state.isOpenedMessageModalWindow);
  const setIsOpenedMessageModalWindow = chatsStore(state => state.setIsOpenedMessageModalWindow);

  useEffect(() => {
    async function makeRequest() {
      if (token) {
        const chatsWithSearchAccounts = await getChatsWithSearchAccounts(search, token);
        if (chatsWithSearchAccounts?.data) {
          setInbox(chatsWithSearchAccounts?.data.chats);
        }
      }
    }

    makeRequest();
  }, []);

  // чтобы при обнулении search не был произведен лишний запрос
  useEffect(() => {
    async function makeRequest() {
      if (token && search) {
        const chatsWithSearchAccounts = await getChatsWithSearchAccounts(search, token);
        // проверка, требуемая типизацией
        if (chatsWithSearchAccounts?.data) {
          setSearchAccounts(chatsWithSearchAccounts.data.searchAccounts);
        }
      } else {
        // очищаем поиск
        if (searchAccounts.length > 0) {
          setSearchAccounts([]);
        }
      }
    }

    makeRequest();
  }, [search]);

  return (
    <div>
      {/* Без регистрации будет перенаправление на страницу login */}
      {user ? (
        <div>
          <NavBar socket={socket} />
          {isOpenedMessageModalWindow && <MessageModalWindow socket={socket} />}
          <div className={style.container}>
            <InboxBlock socket={socket} />
          </div>
          <div className={style.chatBlock}>
            <div className={style.chatIconBorder}>
              <div className={style.chatIcon}></div>
            </div>
            <div style={{ fontSize: "21px" }}>Ваши сообщения</div>
            <div className={style.messagingInformation}>
              Отправляйте личные фото и сообщения другу или группе
            </div>
            <button
              className={style.sendMessageButton}
              onClick={() => {
                setIsOpenedMessageModalWindow(true);
              }}
            >
              Отправить сообщение
            </button>
          </div>
        </div>
      ) : (
        <Navigate to="/" replace />
      )}
    </div>
  );
};

export default InboxPage;
