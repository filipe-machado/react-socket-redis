import { setupWorker } from "@socket.io/sticky";
import { Server } from "socket.io";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import crypto from "crypto";

const redisClient = new Redis();

const pubClient = redisClient;
const subClient = redisClient.duplicate();

const randomId = () => crypto.randomBytes(8).toString("hex");

import RedisSessionStore, { iSession } from "./store/sessionStore";
const sessionStore = new RedisSessionStore(redisClient);

import RedisMessageStore, { iMessage } from "./store/messageStore";
const messageStore = new RedisMessageStore(redisClient);

const start = (server: any, adapter: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.adapter(adapter);

  io.adapter(createAdapter(pubClient, subClient));

  setupWorker(io);

  io.use(async (socket: any, next: any) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = await sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }

    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }

    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
  });

  io.on("connection", async (socket: any) => {
    // Persiste a sessão
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    // Emite detalhes da sessão
    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
    });

    // Se junta a sala do "userID"
    socket.join(socket.userID);

    // Consulta os usuário exiostentes
    const users: iSession[] = [];
    const [messages, sessions] = await Promise.all([
      messageStore.findMessagesForUser(socket.userID),
      sessionStore.findAllSessions(),
    ]);
    const messagesPerUser = new Map();
    messages.forEach((message: iMessage) => {
      const { from, to } = message;
      const otherUser = socket.userID === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    sessions.forEach((session: iSession) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
        messages: messagesPerUser.get(session.userID) || [],
      });
    });
    socket.emit("users", users);

    // Notifica os usuários existentes
    socket.broadcast.emit("user connected", {
      userID: socket.userID,
      username: socket.username,
      connected: true,
      messages: [],
    });

    // Encaminha a mensagem privata para o recebedor correto
    socket.on("private message", ({ content, to }: iMessage) => {
      const message = {
        content,
        from: socket.userID,
        to,
      };
      socket.to(to).to(socket.userID).emit("private message", message);
      messageStore.saveMessage(message);
    });

    // Notifica os usuários sobre a desconexão
    socket.on("disconnect", async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // Notifica outros usuários
        socket.broadcast.emit("user disconnected", socket.userID);
        // Atualiza o status da conexão da sessão
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        });
      }
    });
  });
};

export default start;
