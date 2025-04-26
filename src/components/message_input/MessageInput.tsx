import React from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { userStore } from "../../store/userStore";
import { chatsStore } from "../../store/chatsStore";
import { postMessage } from "../../lib/requests/chatsRequests";
import style from "./MessagesInput.module.css";

const MessageInput: React.FC<{ socket: Socket }> = ({ socket }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const inbox = chatsStore(state => state.inbox);
  const { chatId } = useParams();
  const currentChat = inbox.find(el => el.id === Number(chatId));
  // контроль, сохранение вводимых сообщений (input) по чатам
  const inputMessages = chatsStore(state => state.inputMessages);
  const currentInputMessage = inputMessages.find(el => el.chatId === currentChat?.id);
  const addInputMessage = chatsStore(state => state.addInputMessage);
  const changeInputMessage = chatsStore(state => state.changeInputMessage);

  async function sendMassage() {
    // проверка, требуемая типизацией
    if (user && token && currentChat && currentInputMessage?.message) {
      const newMessageTime = new Date().getTime();
      const message = await postMessage(
        currentInputMessage.message,
        newMessageTime,
        currentChat.id,
        token
      );

      if (message?.data) {
        // очистка input сообщения
        changeInputMessage(currentChat.id, "");

        socket.emit("sendMessage", {
          message: message.data,
          // необходимо для восстановления чата у себеседника, если он ранее его удалял
          chat: currentChat,
          participants: currentChat.participants
        });
      }
    }
  }

  return (
    <div className={style.container}>
      <textarea
        placeholder="Напишите сообщение..."
        className={style.messageInput}
        value={currentInputMessage ? currentInputMessage.message : ""}
        onChange={e => {
          // проверка, требуемая типизацией
          if (currentChat) {
            if (currentInputMessage) {
              changeInputMessage(currentChat.id, e.target.value);
            } else {
              addInputMessage(currentChat.id, e.target.value);
            }
          }
        }}
      />
      <div className={style.sendButton} onClick={sendMassage}>
        Send
      </div>
    </div>
  );
};

export default MessageInput;
