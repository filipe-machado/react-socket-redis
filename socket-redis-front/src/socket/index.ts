import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import globals from "../../globals.json";
interface iSocket extends Socket {
  userID?: string;
}
const URL = `${globals.protocol}://${globals.host}:${globals.port}`;
const socket: iSocket = io(URL, { autoConnect: false });

export default socket;
