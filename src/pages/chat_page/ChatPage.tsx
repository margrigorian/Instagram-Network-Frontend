import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import NavBar from "../../components/navbar/NavBar";
import InboxBlock from "../../components/inbox_block/InboxBlock";
import ListedChat from "../../components/listed_chat/ListedChat";
import MessagesBlock from "../../components/messages_block/MessagesBlock";
import MessageInput from "../../components/message_input/MessageInput";
import { userStore } from "../../store/userStore";
import { chatsStore } from "../../store/chatsStore";
import { sortMessagesByDate } from "../../lib/sortMessagesByDate";
import { searchStore } from "../../store/searchStore";
import { getInboxAlongWithCurrentChatMessagesAndSearchAccounts } from "../../lib/requests/chatsRequests";
import style from "./ChatPage.module.css";
import * as Icon from "react-bootstrap-icons";

const ChatPage: React.FC<{ socket: Socket }> = ({ socket }) => {
  const { chatId } = useParams();
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const paramForGettingInbox = chatsStore(state => state.paramForGettingInbox);
  const inbox = chatsStore(state => state.inbox);
  const setInbox = chatsStore(state => state.setInbox);
  // получаем информацию о текущем чате, с которым будем работать
  const currentChat = inbox.find(el => el.id === Number(chatId));
  const setIdOfActiveChat = chatsStore(state => state.setIdOfActiveChat);
  const setCurrentChatMessages = chatsStore(state => state.setCurrentChatMessages);
  // поиск
  const search = searchStore(state => state.search);
  const searchAccounts = searchStore(state => state.searchAccounts);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const setInboxLoading = chatsStore(state => state.setInboxLoading);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function makeRequest() {
      if (token && chatId) {
        const inboxAlongWithCurrentChatMessagesAndSearchAccounts =
          await getInboxAlongWithCurrentChatMessagesAndSearchAccounts(
            chatId,
            paramForGettingInbox,
            search,
            token
          );
        if (inboxAlongWithCurrentChatMessagesAndSearchAccounts?.data) {
          // был ли запрос на inbox
          if (inboxAlongWithCurrentChatMessagesAndSearchAccounts.data.chats.length > 0) {
            setInbox(inboxAlongWithCurrentChatMessagesAndSearchAccounts.data.chats);
            // чтобы при перезагрузке страницы избранный чат был подсвечен
            setIdOfActiveChat(Number(chatId));
          }
          // сортируем сообщения по временным блокам
          const dateSortedMessages = sortMessagesByDate(
            [],
            inboxAlongWithCurrentChatMessagesAndSearchAccounts.data.currentChatMessages
          );
          // .reverse() необходим, так как в css на странице MessagesBlock используется flex-direction: column-reverse
          // чтобы изначально сформировался необходимый порядок
          setCurrentChatMessages(dateSortedMessages.reverse());
          setInboxLoading(false);
          setMessagesLoading(false);
        } else {
          // в случае ошибочного запроса
          navigate("/direct/");
        }
      }
    }

    makeRequest();
  }, [chatId]);

  // чтобы при обнулении search не был произведен лишний запрос
  useEffect(() => {
    async function makeRequest() {
      if (token && chatId && search) {
        const inboxAlongWithCurrentChatMessagesAndSearchAccounts =
          await getInboxAlongWithCurrentChatMessagesAndSearchAccounts(
            chatId,
            paramForGettingInbox,
            search,
            token
          );
        // проверка, требуемая типизацией
        if (inboxAlongWithCurrentChatMessagesAndSearchAccounts?.data) {
          setSearchAccounts(inboxAlongWithCurrentChatMessagesAndSearchAccounts.data.searchAccounts);
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
      {" "}
      {/* Без регистрации будет перенаправление на страницу login */}
      {user ? (
        <div>
          <NavBar socket={socket} />
          <div className={style.inboxContainer}>
            <InboxBlock socket={socket} />
          </div>
          <div className={style.chatBlock}>
            <div className={style.chatHeader}>
              {currentChat ? (
                <div className={style.headerElementsContainer}>
                  <div className={style.contact}>
                    <ListedChat
                      chat={{
                        id: currentChat.id,
                        participants: currentChat.participants,
                        type: currentChat.type,
                        creators: currentChat.creators,
                        deleted_from: currentChat.deleted_from
                      }}
                    />
                  </div>
                  <div className={style.iconsContainer}>
                    <Icon.Telephone size={"24px"} style={{ cursor: "pointer" }} />
                    <Icon.CameraVideo size={"28px"} style={{ cursor: "pointer" }} />
                    <Icon.InfoCircle size={"24px"} style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className={style.messagesContainer}>
              {/* проверка, чтобы currentChat.participants можно было передать через пропсы */}
              {currentChat && (
                <MessagesBlock
                  socket={socket}
                  messagesLoading={messagesLoading}
                  participants={currentChat.participants}
                />
              )}
            </div>
            <div className={style.messageSendingContainer}>
              <MessageInput socket={socket} />
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" replace />
      )}
    </div>
  );
};

export default ChatPage;
