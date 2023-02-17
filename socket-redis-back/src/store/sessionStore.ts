import { iMessage } from "./messageStore";
export interface iSession {
  userID: string;
  username: string;
  connected: boolean;
  messages?: iMessage[];
}

const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userID, username, connected]: any) =>
  userID ? { userID, username, connected: connected === "true" } : undefined;

class RedisSessionStore {
  redisClient: any;
  constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  findSession(id: string) {
    return this.redisClient
      .hmget(`session:${id}`, "userID", "username", "connected")
      .then(mapSession);
  }

  saveSession(id: string, { userID, username, connected }: iSession) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userID",
        userID,
        "username",
        username,
        "connected",
        connected
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        "session:*",
        "COUNT",
        "100"
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s: any) => keys.add(s));
    } while (nextIndex !== 0);
    const commands: any = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "userID", "username", "connected"]);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results: any) => {
        return results
          .map(([err, session]: any) => (err ? undefined : mapSession(session)))
          .filter((v: any) => !!v);
      });
  }
}

export default RedisSessionStore;
