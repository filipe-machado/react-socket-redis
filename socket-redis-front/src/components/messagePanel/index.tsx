import Status from "../status";
import { iMessage, iUser } from "../user/types";
import React from "react";
import { iMessagePanel } from "./types";
import "./index.css";

const MessagePanel = ({
  user,
  onSubmit,
  onChange,
  isValid,
  className,
  buttonName,
  text,
}: iUser & iMessagePanel) => {
  const displaySender = (message: iMessage, index: number) => {
    return (
      index === 0 ||
      user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
    );
  };
  React.useEffect(() => {
    console.log(user.messages);
  });
  return (
    <div className={className}>
      <div className="header">
        <Status connected={user.connected} />
        {user.username}
      </div>
      <ul className="messages">
        {user.messages?.map((message, index) => (
          <li className="message" key={index}>
            {displaySender(message, index) && (
              <div className="sender">
                {message.fromSelf ? "(você)" : user.username} diz:
              </div>
            )}
            {message.content}
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="form">
        <input
          onChange={onChange}
          value={text}
          placeholder="mensagem..."
          className="input"
        />
        <button className="send-button" disabled={!isValid}>
          {buttonName}
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;
