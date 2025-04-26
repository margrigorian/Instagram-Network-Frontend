import React from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import ListedAccount from "../listed_account/ListedAccount";
import { userStore } from "../../store/userStore";
import { chatsStore } from "../../store/chatsStore";
import { deleteMesseageOrGroupParticipantOrChat } from "../../lib/requests/chatsRequests";
import { IChat } from "../../store/types/chatsStoreTypes";
import style from "./ChatSettingsDrawer.module.css";
import { Drawer } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ChatSettingsDrawer: React.FC<{ socket: Socket; currentChat: IChat }> = ({
  socket,
  currentChat
}) => {
  const user = userStore(state => state.user);
  const token = userStore(state => state.token);
  const isOpenedChatSettingsDrawer = chatsStore(state => state.isOpenedChatSettingsDrawer);
  const setIsOpenedChatSettingsDrawer = chatsStore(state => state.setIsOpenedChatSettingsDrawer);
  const deleteChat = chatsStore(state => state.deleteChat);
  const setCurrentChatMessages = chatsStore(state => state.setCurrentChatMessages);
  const navigate = useNavigate();

  async function deleteGroupParticipant(login: string) {
    if (token) {
      const deletedGroupParticipant = await deleteMesseageOrGroupParticipantOrChat(
        currentChat.id,
        null,
        login,
        token
      );
      // необходимо убедиться, что удаление прошло успешно
      if (deletedGroupParticipant?.data) {
        socket.emit("deleteGroupParticipant", {
          chatId: currentChat.id,
          deletedParticipant: login,
          participants: currentChat.participants
        });
      }
    }
  }

  async function deleteGroup() {
    if (token) {
      const deletedGroup = await deleteMesseageOrGroupParticipantOrChat(
        currentChat.id,
        null,
        null,
        token
      );
      // необходимо убедиться, что удаление прошло успешно
      if (deletedGroup?.data) {
        socket.emit("deleteGroup", {
          chatId: currentChat.id,
          participants: currentChat.participants
        });
      }
    }
  }

  async function deleteDialog() {
    if (token) {
      const deletedDialog = await deleteMesseageOrGroupParticipantOrChat(
        currentChat.id,
        null,
        null,
        token
      );
      // необходимо убедиться, что удаление прошло успешно
      if (deletedDialog?.data) {
        deleteChat(currentChat.id);
        setCurrentChatMessages([]);
        navigate("/direct/");
      }
    }
  }

  return (
    <Drawer
      anchor={"right"}
      open={isOpenedChatSettingsDrawer}
      onClick={() => {
        setIsOpenedChatSettingsDrawer(false);
      }}
    >
      {/* чтобы не возникало вопросов по типизации user */}
      {user && (
        <div className={style.container} onClick={e => e.stopPropagation()}>
          <div className={style.header}>
            <div>Информация</div>
            <CloseOutlinedIcon
              sx={{ fontSize: "26px", cursor: "pointer" }}
              onClick={() => {
                setIsOpenedChatSettingsDrawer(false);
              }}
            />
          </div>
          <div className={style.titleParticipants}>Участники</div>
          <div className={style.participantsContainer}>
            {currentChat.participants.map(
              (participant, i) =>
                participant.login !== user?.login && (
                  <div key={`participantId=${i}`} className={style.participant}>
                    <div onClick={() => setIsOpenedChatSettingsDrawer(false)}>
                      <ListedAccount listedAccount={participant} />
                    </div>
                    {currentChat.type === "group" && currentChat.creators === user?.login && (
                      <div
                        className={style.deleteParticipantButton}
                        onClick={() => deleteGroupParticipant(participant.login)}
                      >
                        Удалить
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
          <div className={style.menuContainer}>
            <div style={{ marginBottom: "10px" }} className={style.menuItem}>
              Пожаловаться
            </div>
            {currentChat.type === "group" && (
              <div
                style={{ marginBottom: "10px" }}
                className={style.menuItem}
                onClick={() => {
                  setIsOpenedChatSettingsDrawer(false);
                  deleteGroupParticipant(user.login);
                }}
              >
                Покинуть чат
              </div>
            )}
            {(currentChat.type === "dialog" || currentChat.creators === user?.login) && (
              <div
                className={style.menuItem}
                onClick={() => {
                  setIsOpenedChatSettingsDrawer(false);
                  if (currentChat.type === "group") {
                    deleteGroup();
                  } else {
                    deleteDialog();
                  }
                }}
              >
                Удалить чат
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default ChatSettingsDrawer;
