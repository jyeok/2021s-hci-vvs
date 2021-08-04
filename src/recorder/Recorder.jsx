/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-bitwise */

import React from "react";
import { io } from "socket.io-client";

import getUserMedia from "get-user-media-promise";
import { Button } from "@material-ui/core";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const BUFFER_SIZE = 4096;
const CONSTRAINTS = {
  audio: true,
  video: false,
};
const chunks = [];

let micRecord;
let socket;
let context;
let processor;
let input;
let globalStream;

const f32toi16 = (buffer) => {
  let l = buffer.length - 1;
  const buf = new Int16Array(l);

  while (l) {
    buf[l] = buffer[l] * 0xffff;
    l -= 1;
  }

  return buf.buffer;
};

const onEnd = () => {
  micRecord.stop();
  socket.emit("recordEnd");
  socket.offAny();

  if (globalStream && globalStream.getTracks() && globalStream.getTracks()[0])
    globalStream.getTracks()[0].stop();

  if (processor) {
    if (input) {
      try {
        input.disconnect(processor);
        processor.disconnect(context.destination);
      } catch (err) {
        console.log(err);
      }
    }
  }

  if (context) {
    context.close().then(() => {
      input = null;
      processor = null;
    });
  }
};

const onStart = async () => {
  console.log("start");

  try {
    context = new AudioContext();
    await context.audioWorklet.addModule("/lib/float-to-int-processor.js");
    const tempNode = new AudioWorkletNode(context, "float-to-int-processor");
    processor = context.createScriptProcessor(BUFFER_SIZE, 1, 1);
    processor.connect(context.destination);
    context.resume();

    getUserMedia(CONSTRAINTS)
      .then((stream) => {
        socket = io("http://localhost:3001/", {
          reconnection: false,
        });

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
            console.log(`interim:${data}`);
          });
        });

        micRecord = new MediaRecorder(stream);

        micRecord.onstop = () => {
          const blob = new Blob(chunks, {
            type: "audio/webm;codecs=opus",
          });

          const audioURL = URL.createObjectURL(blob);
          console.log(audioURL);
        };

        micRecord.ondataavailable = (e) => {
          chunks.push(e.data);
          console.log("e: ", e);
        };

        micRecord.start();

        globalStream = stream;

        input = context.createMediaStreamSource(stream);
        input.connect(processor);

        processor.onaudioprocess = (e) => {
          const raw = e.inputBuffer.getChannelData(0);
          const converted = f32toi16(raw);
          console.log(raw);

          socket.emit("recordData", converted);
        };
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
