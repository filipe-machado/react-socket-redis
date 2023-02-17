const CONVERSATION_TTL = 0.1 * 60 * 60;

export interface iMessage {
  from: string;
  to: string;
  content?: string;
}

class RedisMessageStore {
  redisClient: any;
  constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  saveMessage(message: iMessage) {
    const value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush(`messages:${message.from}`, value)
      .rpush(`messages:${message.to}`, value)
      .expire(`messages:${message.from}`, CONVERSATION_TTL)
      .expire(`messages:${message.to}`, CONVERSATION_TTL)
      .exec();
  }

  findMessagesForUser(userID: string) {
    return this.redisClient
      .lrange(`messages:${userID}`, 0, -1)
      .then((results: any) => {
        return results.map((result: any) => JSON.parse(result));
      });
  }
}

export default RedisMessageStore;
