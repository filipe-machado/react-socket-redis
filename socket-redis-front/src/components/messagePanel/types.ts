interface iMessagePanel {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  isValid?: boolean;
  className: string;
  buttonName: string;
  text: string;
}

export type { iMessagePanel };
