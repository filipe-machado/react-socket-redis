import express from "express";
import cors from "cors";
import start from "./socket";
import http from "http";

import { Router, Request, Response } from "express";

const app = express();

const route = Router();

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world with Typescript" });
});

const httpServer = http.createServer(app);

app.use(route);
app.use(cors());

process.stdout.write("server running on port 3333");

httpServer.listen(3333, "::", () => {
  const message = "Server running on port " + 3333;
});

start(httpServer);
