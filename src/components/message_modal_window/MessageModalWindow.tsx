import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import SearchInput from "../search_input/SearchInput";
import ListedAccount from "../listed_account/ListedAccount";
import { userStore } from "../../store/userStore";
import { chatsStore } from "../../store/chatsStore";
import { searchStore } from "../../store/searchStore";
import { createChat } from "../../lib/requests/chatsRequests";
import style from "./MessageModalWindow.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Radio from "@mui/material/Radio";

const MessageModalWindow: React.FC<{ socket: Socket }> = ({ socket }) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const setIsOpenedMessageModalWindow = chatsStore(state => state.setIsOpenedMessageModalWindow);
  const inbox = chatsStore(state => state.inbox);
  const setParamForGettingInbox = chatsStore(state => state.setParamForGettingInbox);
  const searchAccounts = searchStore(state => state.searchAccounts);
  const setSearchAccounts = searchStore(state => state.setSearchAccounts);
  const search = searchStore(state => state.search);
  const setSearch = searchStore(state => state.setSearch);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const navigate = useNavigate();

  function handleModalClose() {
    setSearch("");
    setSearchAccounts([]);
    setIsOpenedMessageModalWindow(false);
  }

  function handleRadio(contact: string) {
    const isExistedContact = findContact(contact);

    if (!isExistedContact) {
      setSelectedContacts([...selectedContacts, contact]);
    } else {
      filterContacts(contact);
    }
  }

  function findContact(contact: string) {
    const foundContact = selectedContacts.find(el => el === contact);

    if (foundContact) {
      return true;
    } else {
      return false;
    }
  }

  function filterContacts(contact: string) {
    const filteredContacts = selectedContacts.filter(el => el !== contact);
    setSelectedContacts(filteredContacts);
  }

  async function checkAndCreateChat() {
    // проверка наличия диалога в inbox
    if (selectedContacts.length === 1) {
      const chat = inbox.find(
        el =>
          el.type === "dialog" &&
          (el.participants[0].login === selectedContacts[0] ||
            el.participants[1].login === selectedContacts[0])
      );

      if (chat) {
        // чтобы не было на странице чата повторного запроса inbox
        setParamForGettingInbox(false);
        navigate(`/direct/${chat.id}`);
        handleModalClose();
        return;
      }
    }

    if (token) {
      // создание диалогов и групп
      const newChat = await createChat(selectedContacts, token);
      if (newChat?.data && user) {
        socket.emit("addChat", {
          chat: newChat.data
        });
        // чтобы не было на странице чата повторного запроса inbox
        setParamForGettingInbox(false);
        navigate(`/direct/${newChat.data.id}`);
      }
      handleModalClose();
    }
  }

  return (
    <div
      className={style.modalContainer}
      onClick={() => {
        handleModalClose();
      }}
    >
      <div
        className={style.modal}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className={style.header}>
          <div style={{ width: "27px" }}></div>
          <div style={{ fontWeight: "700" }}>Новое сообщение</div>
          <CloseOutlinedIcon
            sx={{ fontSize: "28px", cursor: "pointer" }}
            onClick={() => {
              handleModalClose();
            }}
          />
        </div>
        <div className={style.searchContainer}>
          <SearchInput />
        </div>
        <div className={style.selectedContactsContainer}>
          <div className={style.whomText}>Кому:</div>
          {selectedContacts.length > 0
            ? selectedContacts.map((el, i) => (
                <div key={`contactId-${i}`} className={style.selectedContact}>
                  <div className={style.loginOfSelectedContact}>{el}</div>
                  <CloseOutlinedIcon
                    sx={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={() => {
                      filterContacts(el);
                    }}
                  />
                </div>
              ))
            : "..."}
        </div>
        <div className={style.containerOfContactsAndButton}>
          <div>
            {!search && <div className={style.recommendationHeader}>Рекомендуемые</div>}
            <div
              className={style.contactsContainer}
              style={!search ? { height: "161px" } : { height: "184px" }}
            >
              {search ? (
                searchAccounts.length > 0 ? (
                  searchAccounts.map(
                    (el, i) =>
                      el.login !== user?.login && (
                        <div
                          key={`contactId-${i}`}
                          className={style.contact}
                          onClick={() => handleRadio(el.login)}
                        >
                          <ListedAccount
                            listedAccount={{
                              login: el.login,
                              username: el.username,
                              avatar: el.avatar,
                              verification: el.verification
                            }}
                          />
                          <Radio
                            checked={findContact(el.login)}
                            value={el.login}
                            name="radio-buttons"
                            sx={{
                              color: "black",
                              "&.Mui-checked": {
                                color: "black"
                              }
                            }}
                          />
                        </div>
                      )
                  )
                ) : (
                  <div className={style.notFoundText}>Аккаунты не найдены</div>
                )
              ) : inbox.find(el => el.type === "dialog") ? (
                inbox.map(
                  (el, i) =>
                    el.type === "dialog" &&
                    // исключаем удаленные контакты
                    el.participants[0].deleted !== true &&
                    el.participants[1].deleted !== true && (
                      <div
                        key={`contactId-${i}`}
                        className={style.contact}
                        onClick={() =>
                          handleRadio(
                            el.participants[0].login !== user?.login
                              ? el.participants[0].login
                              : el.participants[1].login
                          )
                        }
                      >
                        <ListedAccount
                          listedAccount={
                            el.participants[0].login !== user?.login
                              ? el.participants[0]
                              : el.participants[1]
                          }
                        />
                        <Radio
                          checked={findContact(
                            el.participants[0].login !== user?.login
                              ? el.participants[0].login
                              : el.participants[1].login
                          )}
                          value={el.participants[0].login}
                          name="radio-buttons"
                          sx={{
                            color: "black",
                            "&.Mui-checked": {
                              color: "black"
                            }
                          }}
                        />
                      </div>
                    )
                )
              ) : (
                <div className={style.notFoundText}>Чатов пока нет</div>
              )}
            </div>
          </div>
          <button
            disabled={selectedContacts.length > 0 ? false : true}
            className={selectedContacts.length > 0 ? style.chatButton : style.disabledChatButton}
            onClick={checkAndCreateChat}
          >
            Чат
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModalWindow;
