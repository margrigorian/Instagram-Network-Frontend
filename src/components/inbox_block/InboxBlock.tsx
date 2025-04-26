import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import ListedChat from "../listed_chat/ListedChat";
import { userStore } from "../../store/userStore";
import { chatsStore } from "../../store/chatsStore";
import { sortMessagesByDate } from "../../lib/sortMessagesByDate";
import { IChat, IMessage } from "../../store/types/chatsStoreTypes";
import style from "./InboxBlock.module.css";

const InboxBlock: React.FC<{ socket: Socket }> = ({ socket }) => {
  const user = userStore(state => state.user);
  const inbox = chatsStore(state => state.inbox);
  const setParamForGettingInbox = chatsStore(state => state.setParamForGettingInbox);
  const inboxLoading = chatsStore(state => state.inboxLoading);
  const changeLastMessageOfChatInInbox = chatsStore(state => state.changeLastMessageOfChatInInbox);
  const deleteLastMessageOfChatInInbox = chatsStore(state => state.deleteLastMessageOfChatInInbox);
  const deleteGroupParticipant = chatsStore(state => state.deleteGroupParticipant);
  const deleteChat = chatsStore(state => state.deleteChat);
  const idOfActiveChat = chatsStore(state => state.idOfActiveChat);
  const setIdOfActiveChat = chatsStore(state => state.setIdOfActiveChat);
  const addChat = chatsStore(state => state.addChat);
  const currentChatMessages = chatsStore(state => state.currentChatMessages);
  const setCurrentChatMessages = chatsStore(state => state.setCurrentChatMessages);
  const deleteMessageInCurrentChat = chatsStore(state => state.deleteMessageInCurrentChat);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chat", (chat: IChat) => {
      if (chat.type === "dialog") {
        // проверка необходима, так как диалог может уже присутствовать в inbox
        // рассылка же инициирована пользователем, ранее удалившем диалог со своей стороны
        // проверяем, чтобы не случилось дублирования чата в inbox
        const isExistingDialog = inbox.find(el => el.id === chat.id);
        if (!isExistingDialog) {
          // или же это добавление нового диалога
          addChat(chat);
        }
      } else {
        // добавление новой группы в inbox
        addChat(chat);
      }
    });

    socket.on("message", (data: { message: IMessage; chat: IChat }) => {
      const isExistingChat = inbox.find(chat => chat.id === data.chat.id);
      // если пользователь ранее удалял диалог, в inbox он отсутствует, восстанавливаем
      if (!isExistingChat) {
        addChat(data.chat);
      }
      // если сообщение отправлено текущим пользователем, отмечаем его как изначально прочитанное
      if (data.message.sender.login === user?.login) {
        data.message.is_read = true;
      }
      changeLastMessageOfChatInInbox(data.message);

      // проверка, чтобы не добавлялось сообщение к другому чату
      if (data.message.chat_id === idOfActiveChat) {
        // отсортироваваем сообщение по временному блоку
        const dateSortedMessages = sortMessagesByDate(currentChatMessages, [data.message]);
        setCurrentChatMessages(dateSortedMessages);
      }
    });

    socket.on("deletedMessage", (data: { chatId: number; messageId: number }) => {
      // INBOX BLOCK
      // удаленное сообщение является последним в чате?
      const isLastMesssage = inbox.find(
        el => el.id === data.chatId && el.last_message?.id === data.messageId
      );
      // тогда обновляем lastMessage в inbox
      if (isLastMesssage) {
        let previousMessage: IMessage | null = null;
        // проверка в текущем временном блоке сообщений
        if (currentChatMessages[0].messages.length > 1) {
          previousMessage =
            currentChatMessages[0].messages[currentChatMessages[0].messages.length - 2];
        } else if (currentChatMessages[1]) {
          // переход к следующему блоку
          previousMessage =
            currentChatMessages[1].messages[currentChatMessages[1].messages.length - 1];
        }
        // определили предыдущее сообщение, вносим изменения
        if (previousMessage) {
          changeLastMessageOfChatInInbox(previousMessage);
        } else {
          deleteLastMessageOfChatInInbox(data.chatId);
        }
      }

      // MESSAGES BLOCK
      // проверка, чтобы не было удаления из другого чата
      if (idOfActiveChat === data.chatId) {
        deleteMessageInCurrentChat(data.messageId);
      }
    });

    socket.on("deletedGroupParticipant", (data: { chatId: number; deletedParticipant: string }) => {
      if (data.deletedParticipant !== user?.login) {
        deleteGroupParticipant(data.chatId, data.deletedParticipant);
      } else {
        // исключили из группы текущего пользователя
        deleteChat(data.chatId);
        setCurrentChatMessages([]);
        if (idOfActiveChat === data.chatId) {
          // если ранее был открыт данный групповой чат, делаем перенаправление
          navigate("/direct/");
        }
      }
    });

    socket.on("deletedGroup", (data: { chatId: number }) => {
      deleteChat(data.chatId);
      setCurrentChatMessages([]);
      if (idOfActiveChat === data.chatId) {
        // если ранее был открыт данный групповой чат, делаем перенаправление
        navigate("/direct/");
      }
    });

    return () => {
      socket.off("chat");
      socket.off("message");
      socket.off("deletedMessage");
      socket.off("deletedParticipant");
      socket.off("deletedGroup");
    };
  }, [socket, inbox, currentChatMessages]);

  return (
    <div className={style.container}>
      <div className={style.header}>Соообщения</div>
      {inboxLoading ? (
        <div className={style.loading}></div>
      ) : inbox.length > 0 ? (
        <div className={style.inbox}>
          {inbox.map(el => (
            <div
              className={style.chat}
              key={`chatId-${el.id}`}
              style={
                idOfActiveChat === el.id ? { backgroundColor: "rgb(242, 240, 240)" } : undefined
              }
              onClick={() => {
                setIdOfActiveChat(el.id);
                setParamForGettingInbox(false);
                navigate(`/direct/${el.id}`);
              }}
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
