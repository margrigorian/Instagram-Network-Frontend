import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Socket } from "socket.io-client";
import { userStore } from "../../store/userStore";
import { chatsStore } from "../../store/chatsStore";
import { messageDateAndTimeCalculation } from "../../lib/messageDateAndTimeCalculation";
import {
  deleteMessageOrGroupParticipantOrChat,
  readMessage
} from "../../lib/requests/chatsRequests";
import { IMessage } from "../../store/types/chatsStoreTypes";
import { IListedAccount } from "../../store/types/accountStoreTypes";
import style from "./MessagesBlock.module.css";
import * as Icon from "react-bootstrap-icons";

interface MessageRefs {
  [key: string]: {
    element: HTMLDivElement;
    message: IMessage;
  };
}

const MessagesBlock: React.FC<{
  socket: Socket;
  messagesLoading: boolean;
  participants: IListedAccount[];
}> = ({ socket, messagesLoading, participants }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const currentChatMessages = chatsStore(state => state.currentChatMessages);
  const readMessageInCurrentChat = chatsStore(state => state.readMessageInCurrentChat);
  const readLastMessageInInboxChat = chatsStore(state => state.readLastMessageInInboxChat);
  const messageRefs = useRef<MessageRefs>({});

  useEffect(() => {
    // IntersectionObserver определяет видимость элемента, работает асинхронно
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // пересекает область видимости?
          if (entry.isIntersecting) {
            // получаем dom-элемент
            const targetElement = entry.target as HTMLDivElement;
            // находим messageId, который был указан как data-атрибут у этого dom-элемента
            const messageId = targetElement.dataset.messageId;
            if (messageId && messageRefs.current[`messageId-${messageId}`]) {
              // извлекаем message, ранее переданный
              const messageData = messageRefs.current[`messageId-${messageId}`].message;
              readMessageInCurrentChat(messageData.id);
              readLastMessageInInboxChat(messageData.chat_id);
              // отписываемся от наблюдения, чтобы не срабатывало повторно на элементе, не тратило ресурсы
              observer.unobserve(targetElement);
              if (token) {
                readMessage(messageData.chat_id, messageData.id, token);
              }
            }
          }
        });
      },
      {
        // Процент видимости элемента (от 0 до 1)
        threshold: 0.1
        // при 1 не срабатывает
      }
    );

    // Начинаем наблюдение после рендера всех сообщений
    Object.keys(messageRefs.current).forEach(key => {
      observer.observe(messageRefs.current[key].element);
    });

    // размонтирование
    return () => {
      observer.disconnect();
    };
  }, [messagesLoading, currentChatMessages]);

  function deleteMessage(chatId: number, messageId: number) {
    if (token) {
      socket.emit("deleteMessage", {
        chatId,
        messageId,
        participants
      });
      deleteMessageOrGroupParticipantOrChat(chatId, messageId, null, token);
    }
  }

  return (
    <div
      style={
        currentChatMessages.length === 0
          ? { justifyContent: "center", alignItems: "center" }
          : undefined
      }
      className={style.container}
    >
      {messagesLoading ? (
        <div className={style.loading}></div>
      ) : currentChatMessages.length > 0 ? (
        currentChatMessages.map((el, i) => (
          <div key={`messageBlockId-${i}`}>
            <div className={style.messageBlockTime}>{messageDateAndTimeCalculation(el.time)}</div>
            {el.messages.map((message, k) =>
              message.sender.login !== user?.login ? (
                // СТОРОНА СОБЕСЕДНИКОВ
                <div
                  key={`messageId-${message.id}`}
                  style={
                    // условие k !== 0 исключает ошибку
                    k !== 0 && el.messages[k - 1].sender.login !== user?.login
                      ? { marginTop: "4px" }
                      : { marginTop: "15px" }
                  }
                  className={style.participantMessageContainer}
                  ref={element => {
                    // проверка необходима
                    if (element && !message.is_read) {
                      // таким образом мы можем передать информацию о message
                      messageRefs.current[`messageId-${message.id}`] = { element, message };
                    } else {
                      // удаление отработанных элементов
                      delete messageRefs.current[`messageId-${message.id}`];
                    }
                  }}
                  // data-атрибут для связи
                  data-message-id={message.id}
                >
                  {/* чтобы аватар отрисовывался у последнего сообщения */}
                  {(k === el.messages.length - 1 ||
                    el.messages[k + 1].sender.login !== message.sender.login) && (
                    <NavLink to={`/accounts/${message.sender.login}`}>
                      {message.sender.avatar ? (
                        <img src={message.sender.avatar} className={style.participantAvatar} />
                      ) : (
                        <Icon.PersonCircle className={style.defaultAvatar} />
                      )}
                    </NavLink>
                  )}
                  <div className={style.messageAndBasketContainer}>
                    <div
                      style={
                        // для сообщения без аватара указываем отступ
                        k !== el.messages.length - 1 &&
                        el.messages[k + 1].sender.login === message.sender.login
                          ? { marginLeft: "42px", backgroundColor: "rgb(242, 240, 240)" }
                          : { backgroundColor: "rgb(242, 240, 240)" }
                      }
                      className={style.message}
                    >
                      {message.message}
                    </div>
                    {!message.is_read && <div className={style.unreadMessageCircleIcon}></div>}
                  </div>
                </div>
              ) : (
                // СТОРОНА ПОЛЬЗОВАТЕЛЯ
                <div
                  key={`messageId-${message.id}`}
                  className={style.userMessageContainer}
                  style={
                    // условие k !== 0 исключает ошибку
                    k !== 0 && el.messages[k - 1].sender.login === user?.login
                      ? { marginTop: "4px" }
                      : { marginTop: "15px" }
                  }
                >
                  <Icon.Trash3
                    className={style.basket}
                    onClick={() => deleteMessage(message.chat_id, message.id)}
                  />
                  <div
                    style={{ backgroundColor: "#2196f3", color: "white" }}
                    className={style.message}
                  >
                    {message.message}
                  </div>
                </div>
              )
            )}
          </div>
        ))
      ) : (
        <div style={{ color: "grey" }}>Сообщений нет</div>
      )}
    </div>
  );
};

export default MessagesBlock;
