import { Server } from "socket.io";

const start = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket: any, next: any) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  io.on("connection", (socket: any) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: (socket as any).username,
      });
    }
    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.username,
    });

    socket.on("private message", ({ content, to }: Record<any, any>) => {
      socket.to(to).emit("private message", {
        content,
        from: socket.id,
      });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", socket.id);
    });
  });
};

export default start;
