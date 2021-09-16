import React, { useState } from "react";
import propTypes from "prop-types";
import { io } from "socket.io-client";

import getUserMedia from "get-user-media-promise";
import { useSnackbar } from "notistack";

import { Button, Grid, Typography } from "@material-ui/core";
import { PlayArrow, Save, Stop } from "@material-ui/icons";

import { f32toi16 } from "./Util";
import { RECORD_STATUS, SPEECH } from "./constants";

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

const Recorder = (props) => {
  const [audioSrc, setAudioSrc] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const {
    speechHandler: {
      onSpeechError,
      onInterim,
      onTranscript,
      onSaveVoice,
      onSaveRecord,
    },
    recordStatus: [status, setStatus],
  } = props;

  const onAudioData = (e) => {
    const buffer = e.data;
    const converted = f32toi16(buffer);

    if (socket) socket.emit(SPEECH.AUDIO_DATA, converted);
  };

  const initSocket = () => {
    socket = io(SPEECH.URL, {
      reconnection: false,
    });

    socket.on("connect", () => {
      enqueueSnackbar("녹음이 시작되었습니다.", {
        variant: "success",
      });

      socket.emit(SPEECH.START);

      socket.on(SPEECH.TRANSCRIPT_ERROR, onSpeechError);
      socket.on(SPEECH.SPEECH_DATA, onTranscript);
      socket.on(SPEECH.SPEECH_INTERIM_DATA, onInterim);
    });

    socket.on("connect_error", () => {
      enqueueSnackbar(
        "녹음 서버와 연결할 수 없습니다. 인터넷 연결을 확인해 보세요.",
        {
          variant: "warning",
        }
      );
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
      setAudioSrc(audioURL);
      setStatus(RECORD_STATUS.READY);
      onSaveVoice(blob);
    };

    micRecord.ondataavailable = (e) => {
      recordData.push(e.data);
    };

    micRecord.start();
  };

  const onStart = async () => {
    if (globalStream) return;

    setStatus(RECORD_STATUS.RECORDING);

    try {
      const stream = await getUserMedia(CONSTRAINTS);
      globalStream = stream;
      context = new AudioContext();
      await context.audioWorklet.addModule(DATA_RECIEVER_URL);
      reciever = new AudioWorkletNode(context, DATA_RECIEVER);
      reciever.port.onmessage = onAudioData;
      input = context.createMediaStreamSource(stream);
      context.resume();

      input.connect(reciever);
      reciever.connect(context.destination);

      initRecorder(stream, setAudioSrc);
      initSocket({ onSpeechError, onInterim, onTranscript });
    } catch (err) {
      onSpeechError(err);
    }
  };

  const onRecordEnd = () => {
    if (micRecord) micRecord.stop();
    if (socket) {
      socket.emit(SPEECH.END);
      socket.offAny();
      socket.disconnect();
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

    setStatus(RECORD_STATUS.WAITING);
  };

  return (
    <>
      <Grid item xs={5} />
      <Grid item xs={1}>
        <Button
          onClick={onStart}
          startIcon={<PlayArrow />}
          disabled={status === RECORD_STATUS.RECORDING || !!audioSrc}
        >
          <Typography variant="button">녹음 시작</Typography>
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button
          startIcon={<Stop />}
          onClick={onRecordEnd}
          disabled={status !== RECORD_STATUS.RECORDING || !!audioSrc}
        >
          <Typography variant="button">녹음 중지</Typography>
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button
          startIcon={<Save />}
          onClick={onSaveRecord}
          disabled={!audioSrc}
        >
          <Typography variant="button">녹음 저장</Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Recorder;

Recorder.propTypes = {
  speechHandler: propTypes.shape({
    onTranscript: propTypes.func.isRequired,
    onSpeechError: propTypes.func.isRequired,
    onInterim: propTypes.func.isRequired,
    onSaveVoice: propTypes.func.isRequired,
    onSaveRecord: propTypes.func.isRequired,
  }).isRequired,
  recordStatus: propTypes.arrayOf(propTypes.any).isRequired,
};
