import React from "react";
import { userStore } from "../../store/userStore";
import { IChat } from "../../store/types/chatsStoreTypes";
import { IListedAccount } from "../../store/types/accountStoreTypes";
import { postDateCalculation } from "../../lib/postDateCalculation";
import style from "./ListedChat.module.css";
import * as Icon from "react-bootstrap-icons";

const ListedChat: React.FC<{ chat: IChat }> = listedChat => {
  const user = userStore(state => state.user);
  let dialogContact: IListedAccount | null = null;
  let groupContact = "";

  if (listedChat.chat.type === "dialog") {
    dialogContact = listedChat.chat.participants.filter(el => el.login !== user?.login)[0];
  } else {
    listedChat.chat.participants.forEach((el, i, self) => {
      if (i !== self.length - 1) {
        groupContact += `${el.username ? el.username : el.login}, `;
      } else {
        groupContact += `${el.username ? el.username : el.login}`;
      }
    });
  }

  return (
    <div className={style.container}>
      <div className={style.contact}>
        <div>
          {dialogContact ? (
            dialogContact.avatar ? (
              <img src={dialogContact.avatar} className={style.dialogAvatar} />
            ) : (
              <Icon.PersonCircle className={style.defaultAvatar} />
            )
          ) : (
            <div className={style.groupAvatar}></div>
          )}
        </div>

        <div
          className={style.chatInfoContainer}
          style={
            listedChat.chat.last_message
              ? { justifyContent: "space-between" }
              : { justifyContent: "center" }
          }
        >
          <div className={style.loginContainer}>
            <div
              className={style.login}
              style={
                listedChat.chat.last_message && !listedChat.chat.last_message.is_read
                  ? { fontWeight: "600" }
                  : undefined
              }
            >
              {dialogContact
                ? dialogContact.username
                  ? dialogContact.username
                  : dialogContact.login
                : groupContact}
            </div>

            {dialogContact
              ? dialogContact.verification && <div className={style.verificationIcon}></div>
              : ""}
          </div>

          {listedChat.chat.last_message && (
            <div className={style.messageContainer}>
              <div
                className={style.message}
                style={
                  !listedChat.chat.last_message.is_read ? { fontWeight: "700" } : { color: "grey" }
                }
              >
                {listedChat.chat.last_message.sender.login === user?.login
                  ? `Вы: ${listedChat.chat.last_message.message}`
                  : listedChat.chat.last_message.message}
              </div>
              <Icon.Dot className={style.dotIcon} />
              <div className={style.messageDate}>
                {postDateCalculation(listedChat.chat.last_message.time, "message")}
              </div>
            </div>
          )}
        </div>
      </div>
      {listedChat.chat.last_message && !listedChat.chat.last_message.is_read && (
        <div className={style.unreadMessageCircleIcon}></div>
      )}
    </div>
  );
};

export default ListedChat;
