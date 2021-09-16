export const SPEECH = {
  URL: "http://localhost:3001/",
  START: "recordStart",
  END: "recordEnd",
  AUDIO_DATA: "recordData",
  TRANSCRIPT_ERROR: "recordError",
  SPEECH_DATA: "speechData",
  SPEECH_INTERIM_DATA: "interimData",
};

export const RECORD_STATUS = {
  ERROR: -1,
  WAITING: 0,
  RECORDING: 1,
  READY: 2,
};

export default {
  SPEECH,
  RECORD_STATUS,
};
