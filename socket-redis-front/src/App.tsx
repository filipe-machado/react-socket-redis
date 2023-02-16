import "./App.css";
import Chat from "./components/chat";
import React from "react";
import socket from "./socket";
import FormUser from "./components/formUser";

function App() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] =
    React.useState(false);

  const [username, setUsername] = React.useState("");

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  React.useEffect(() => {
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    });
    const cleanup = () => {
      socket.off("connect_error");
    };
    return cleanup;
  }, []);

  const screen = () => {
    if (!usernameAlreadySelected) {
      return (
        <FormUser
          onSubmit={submit}
          onChange={(e: any) => setUsername(e.target.value)}
          disabled={!username.length}
          buttonName="Confirmar"
        />
      );
    } else {
      return <Chat />;
    }
  };

  return <div id="app">{screen()}</div>;
}

export default App;
