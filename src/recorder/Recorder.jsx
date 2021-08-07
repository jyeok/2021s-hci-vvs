/* eslint-disable no-console */

import React from "react";
import { io } from "socket.io-client";

import getUserMedia from "get-user-media-promise";
import { Button } from "@material-ui/core";
import { f32toi16 } from "./Util";
import { SPEECH } from "./constants";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const CONSTRAINTS = {
  audio: true,
  video: false,
};
const AUDIO_ENCODING = "audio/webm;codecs=opus";
const DATA_RECIEVER = "float-to-int-processor";
const DATA_RECIEVER_URL = "/lib/float-to-int-processor.js";
const recordData = [];

let context;
let globalStream;
let micRecord;
let input;
let reciever;
let socket;

const onEnd = () => {
  if (micRecord) micRecord.stop();
  if (socket) {
    socket.emit("recordEnd");
    socket.offAny();
  }

  if (globalStream) globalStream.getTracks().forEach((track) => track.stop());
  if (input) input.disconnect();
  if (reciever) reciever.disconnect();
  if (context) context.close();

  input = null;
  reciever = null;
  globalStream = null;
  socket = null;
  context = null;
  micRecord = null;
};

const onData = (e) => {
  const buffer = e.data;
  const converted = f32toi16(buffer);

  if (socket) socket.emit(SPEECH.AUDIO_DATA, converted);
};

const onTranscript = (e) => console.log(e);

const onSpeechError = (err) => console.log(err);

const onInterim = (e) => console.log(e);

const initSocket = () => {
  socket = io(SPEECH.URL, {
    reconnection: false,
  });

  socket.on("connect", () => {
    socket.emit(SPEECH.START);

    socket.on(SPEECH.TRANSCRIPT_ERROR, onSpeechError);
    socket.on(SPEECH.SPEECH_DATA, onTranscript);
    socket.on(SPEECH.SPEECH_INTERIM_DATA, onInterim);
  });

  return socket;
};

const initRecorder = (stream) => {
  micRecord = new MediaRecorder(stream);

  micRecord.onstop = () => {
    const blob = new Blob(recordData, {
      type: AUDIO_ENCODING,
    });
    const audioURL = URL.createObjectURL(blob);
    console.log(audioURL);
  };

  micRecord.ondataavailable = (e) => {
    recordData.push(e.data);
  };

  micRecord.start();
};

const onStart = async () => {
  if (globalStream) return;
  try {
    getUserMedia(CONSTRAINTS)
      .then(async (stream) => {
        globalStream = stream;
        context = new AudioContext();
        await context.audioWorklet.addModule(DATA_RECIEVER_URL);
        reciever = new AudioWorkletNode(context, DATA_RECIEVER);
        reciever.port.onmessage = onData;
        input = context.createMediaStreamSource(stream);
        context.resume();

        input.connect(reciever);
        reciever.connect(context.destination);

        initRecorder(stream);
        initSocket();
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
