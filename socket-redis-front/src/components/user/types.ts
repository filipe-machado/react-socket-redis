interface iUser {
  user: {
    userID: string;
    username: string;
    self: boolean;
    connected: boolean;
    hasNewMessages: boolean;
    messages: iMessage[];
  };
}

interface iMessage {
  fromSelf: boolean;
  content: string;
  from?: string;
}

interface iEvent {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface iGlobal {
  selected: boolean;
}

export type { iUser, iGlobal, iEvent, iMessage };
