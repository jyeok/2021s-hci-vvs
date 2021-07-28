/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-bitwise */

import React from "react";
import { io } from "socket.io-client";

import MicrophoneStream from "microphone-stream";
import getUserMedia from "get-user-media-promise";
import { Button } from "@material-ui/core";

let micStream;
let micRecord;
let socket;

const chunks = [];

const int8to16 = (buffer) => {
  const BYTES = 8;
  const SHIFT = BYTES * buffer.BYTES_PER_ELEMENT;
  const buf = new Int16Array(buffer.length / 2);

  for (let i = 0; i < buffer.length; i += 2) {
    const left = buffer[i] << SHIFT;
    const right = buffer[i + 1];

    buf[buf.length - 1 - i / 2] = left | right;
  }

  return buf;
};

const onEnd = () => {
  socket.emit("recordEnd");
  micRecord.stop();
  micStream.destroy();
  console.log("record end");
  console.log("end");
};
const onData = (data) => {
  const converted = int8to16(data);
  console.log(data, converted);
  socket.emit("recordData", converted);
};
const onClose = () => {
  console.log("close");
};
const onError = (err) => {
  console.log(err);
};

const onStart = () => {
  console.log("start");
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const audioContext = new AudioContext();
  const processor = audioContext.createScriptProcessor(2048, 1, 1);
  processor.connect(audioContext.destination);
  audioContext.resume();

  try {
    micStream = new MicrophoneStream({
      objectMode: null,
      bufferSize: 2048,
    });

    getUserMedia({
      video: false,
      audio: true,
    })
      .then((stream) => {
        const input = audioContext.createMediaStreamSource(stream);
        input.connect(processor);

        processor.onaudioprocess = (e) => {
          console.log(e);
        };

        micRecord = new MediaRecorder(stream);

        micRecord.onstop = () => {
          const blob = new Blob(chunks, {
            type: "audio/wav;codecs=opus",
          });

          const audioURL = URL.createObjectURL(blob);
          console.log(audioURL);
        };

        micRecord.ondataavailable = (e) => {
          chunks.push(e.data);
          console.log("e: ", e);
        };

        micRecord.start();
        console.log("Record Started");

        micStream.setStream(stream);
        micStream.on("data", onData);
        micStream.on("end", onEnd);
        micStream.on("close", onClose);
        micStream.on("error", onError);

        socket = io("http://localhost:3001/");

        socket.on("connect", () => {
          console.log("connection!");
          socket.emit("recordStart");

          socket.on("recordError", (error) => {
            console.log(error);
          });

          socket.on("speechData", (data) => {
            console.log(data);
          });

          socket.on("interimData", (data) => {
            console.log(data);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

const Recorder = () => (
  <div>
    <Button onClick={() => onStart()}> 시작 </Button>
    <Button onClick={() => onEnd()}> 끝 </Button>
  </div>
);

export default Recorder;
