import React from "react";
import socket from "../../socket";
import MessagePanel from "../messagePanel";
import User from "../user";
import { iUser } from "../user/types";

const Chat = () => {
  const [users, setUsers] = React.useState<iUser["user"][]>([]);
  const [message, setMessage] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<iUser["user"] | null>(
    null
  );

  const selectUser = (user: iUser["user"]) => {
    setSelectedUser(user);
    user.hasNewMessages = false;
  };

  const onSubmit = (content: React.SyntheticEvent) => {
    content.preventDefault();
    if (selectedUser) {
      socket.emit("private message", {
        content: message,
        to: selectedUser.userID,
      });

      const messages = selectedUser.messages;
      messages.push({ content: message, fromSelf: true });

      setSelectedUser({
        ...selectedUser,
        messages,
      });
      setMessage("");
    }
  };

  const isValid = () => {
    return !!message.length;
  };

  const initReactiveProperties = (user: iUser["user"]) => {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  };

  React.useEffect(() => {
    socket.on("connect", () => {
      const clone = JSON.parse(JSON.stringify(users, null, 2));
      clone.forEach((user: iUser["user"]) => {
        if (user.self) {
          user.connected = true;
        }
      });

      setUsers(clone);
    });

    socket.on("disconnect", () => {
      const clone = JSON.parse(JSON.stringify(users, null, 2));
      clone.forEach((user: iUser["user"]) => {
        if (user.self) {
          user.connected = false;
        }
      });

      setUsers(clone);
    });

    socket.on("users", (socketUsers) => {
      socketUsers.forEach((user: iUser["user"]) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });

      // colocando usuário atual no início e ordenando os outros
      const sorted = socketUsers.sort((a: iUser["user"], b: iUser["user"]) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(sorted);
    });

    socket.on("user connected", (user) => {
      initReactiveProperties(user);
      setUsers([...users, user]);
    });

    socket.on("user disconnected", (id) => {
      const clone = JSON.parse(JSON.stringify(users, null, 2));
      for (const user of clone) {
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
      setUsers(clone);
    });

    socket.on("private message", ({ content, from }) => {
      const clone = JSON.parse(JSON.stringify(users, null, 2));
      for (const user of clone) {
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          });
          if (user.userID !== selectedUser?.userID) {
            user.hasNewMessages = true;
          } else {
            setSelectedUser(user);
          }
          break;
        }
      }

      setUsers(clone);
    });
    const cleanup = () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
    return cleanup;
  });

  return (
    <>
      <div className="left-panel">
        {users.map((user, index) => (
          <User
            key={index}
            user={user}
            selected={selectedUser?.userID === user.userID}
            onClick={(e) => selectUser(user)}
          />
        ))}
      </div>
      {selectedUser && (
        <MessagePanel
          user={selectedUser}
          onSubmit={onSubmit}
          text={message}
          onChange={(e) => setMessage(e.target.value)}
          className="right-panel"
          isValid={isValid()}
          buttonName="Enviar"
        />
      )}
    </>
  );
};

export default Chat;
