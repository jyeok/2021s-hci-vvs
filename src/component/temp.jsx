import { Button } from "@material-ui/core";
import React from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3003/");

const onConnect = () => {
  socket.emit("startRecord");
  socket.on("speechData", (data) => {
    console.log(data);
  });
};

const temp = () => (
  <div>
    <Button onClick={() => onConnect()}> connect </Button>
  </div>
);

export default temp;
