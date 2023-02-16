import React from "react";
import "./index.css";
import { iFormUser } from "./types";

const FormUser: React.FC<iFormUser> = ({
  onChange,
  onSubmit,
  buttonName,
  disabled,
}) => {
  return (
    <div className="select-username">
      <form onSubmit={onSubmit}>
        <input onInput={onChange} placeholder="Seu nome" />
        <button disabled={disabled}>{buttonName}</button>
      </form>
    </div>
  );
};

export default FormUser;
