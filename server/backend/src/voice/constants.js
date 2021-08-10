const CONNECT = "connection";
const DISCONNECT = "disconnect";

const SPEECH = {
  START: "recordStart",
  END: "recordEnd",
  AUDIO_DATA: "recordData",
  TRANSCRIPT_ERROR: "recordError",
  SPEECH_DATA: "speechData",
  SPEECH_INTERIM_DATA: "interimData",
};

module.exports = {
  CONNECT,
  DISCONNECT,
  SPEECH,
};
