import React from "react";
import Status from "../status";
import { iUser, iEvent, iGlobal } from "./types";
import "./index.css";

const User: React.FC<iUser & iEvent & iGlobal> = ({
  onClick,
  selected,
  user,
}) => {
  const status = () => {
    return user.connected ? "online" : "offline";
  };

  return (
    <div onClick={onClick} className={`user ${selected ? "selected" : ""}`}>
      <div className="description">
        <div className="name">
          {user.username} {user.self ? " (você)" : ""}
        </div>
        <div className="status">
          <Status connected={user.connected} /> {status()}
        </div>
      </div>
      {user.hasNewMessages && <div className="new-messages">!</div>}
    </div>
  );
};

export default User;
