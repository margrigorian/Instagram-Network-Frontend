import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import ListedChat from "../listed_chat/ListedChat";
import { chatsStore } from "../../store/chatsStore";
import { IChat } from "../../store/types/chatsStoreTypes";
import style from "./InboxBlock.module.css";

interface IData {
  chat: IChat;
}

const InboxBlock: React.FC<{ socket: Socket }> = ({ socket }) => {
  const inbox = chatsStore(state => state.inbox);
  const [idOfActiveChat, setIdOfActiveChat] = useState(0);
  const addChat = chatsStore(state => state.addChat);

  useEffect(() => {
    socket.on("chat", (data: IData) => {
      if (data.chat.type === "dialog") {
        // проверка необходима, так как диалог может уже присутствовать в inbox
        // рассылка же инициирована пользователем, ранее удалившем диалог со своей стороны
        // проверяем, чтобы не случилось дублирования чата в inbox
        const isExistingDialog = inbox.find(el => el.id === data.chat.id);
        if (!isExistingDialog) {
          // или же это добавление нового диалога
          addChat(data.chat);
        }
      } else {
        // добавление новой группы в inbox
        addChat(data.chat);
      }
    });

    return () => {
      socket.off("chat");
    };
  }, [socket, inbox]);

  return (
    <div className={style.container}>
      <div className={style.header}>Соообщения</div>
      {inbox.length > 0 ? (
        <div className={style.inbox}>
          {inbox.map(el => (
            <div
              className={style.chat}
              key={`chatId-${el.id}`}
              style={
                idOfActiveChat === el.id ? { backgroundColor: "rgb(235, 233, 233)" } : undefined
              }
              onClick={() => setIdOfActiveChat(el.id)}
            >
              <ListedChat chat={el} />
            </div>
          ))}
        </div>
      ) : (
        <div className={style.notFoundText}>Чатов пока нет</div>
      )}
    </div>
  );
};

export default InboxBlock;
