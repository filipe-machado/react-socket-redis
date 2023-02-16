interface iFormUser {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  buttonName: string;
  disabled: boolean;
}

export type { iFormUser };
