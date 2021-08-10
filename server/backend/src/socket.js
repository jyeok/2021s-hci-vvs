/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const _io = require("socket.io");

const Transcriptor = require("./voice/transcriptor");
const { CONNECT, DISCONNECT, SPEECH } = require("./voice/constants");

const speechServer = (server, cors) => {
  const io = _io(server, { cors });

  io.on(CONNECT, (socket) => {
    const trans = new Transcriptor(socket);

    console.log(`New Client ${socket.id} Connected!`);

    socket.on(DISCONNECT, () => {
      console.log(`[Server] Client ${socket.id} disconnected!`);
      trans.endStream();
    });

    socket.on(SPEECH.START, () => {
      console.log("[Server] Record Start");
      trans.startStream();
    });

    socket.on(SPEECH.AUDIO_DATA, (data) => {
      trans.loadData(data);
    });

    socket.on(SPEECH.END, () => {
      console.log("[Server] Record End");
      trans.endStream();
    });
  });

  return io;
};

module.exports = speechServer;
