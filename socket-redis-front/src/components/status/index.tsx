import React from "react";
import "./index.css";

const Status: React.FC<Record<string, boolean>> = ({
  connected,
}: Record<string, boolean>) => {
  return <i className={`icon ${connected ? "connected" : ""}`}></i>;
};

export default Status;
