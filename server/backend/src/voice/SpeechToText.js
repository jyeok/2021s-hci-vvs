/* eslint-disable */

const speech = require("@google-cloud/speech");

let recognizeStream = null;

function postProcessing(results) {
  const textBlockInputs = results.map((r) => {
    const start =
      `${r.words[0].startTime.seconds}` +
      "." +
      r.words[0].startTime.nanos / 100000000;

    const end =
      `${r.words[r.words.length - 1].endTime.seconds}` +
      "." +
      r.words[r.words.length - 1].endTime.nanos / 100000000;

    const result = {
      isHighlighted: 0,
      isModified: 0,
      reliability: r.confidence,
      start: start,
      end: end,
      isMine: 0,
      content: r.transcript,
    };

    return result;
  });

  return textBlockInputs;
}

module.exports = {
  /**
   * @param {object} client A socket client on which to emit events
   * @param {object} GCSServiceAccount The credentials for our google cloud API access
   * @param {object} request A request object of the form expected by streamingRecognize. Variable keys and setup.
   */
  startRecognitionStream(client, request) {
    const speechClient = new speech.SpeechClient();

    recognizeStream = speechClient
      .streamingRecognize(request)
      .on("error", (err) => {
        // eslint-disable-next-line no-console
        console.error(
          `Error when processing audio: ${
            err && err.code ? `Code: ${err.code} ` : ""
          }${err && err.details ? err.details : ""}`
        );
        client.emit("googleCloudStreamError", err);
        this.stopRecognitionStream();
      })
      .on("data", (data) => {
        // if end of utterance, let's restart stream
        // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
        if (data.results[0] && data.results[0].isFinal) {
          const refined_data = postProcessing(data.results[0].alternatives);
          // eslint-disable-next-line no-console
          console.log("[RecognizeStream]: Got data:>>", refined_data);
          client.emit("speechData", refined_data);
          this.stopRecognitionStream();
          this.startRecognitionStream(client, request);
          console.log("restarted stream serverside");
        } else if (data.results[0]) {
          client.emit(
            "interimData",
            data.results[0].alternatives[0].transcript
          );
        }
      });
  },
  /**
   * Closes the recognize stream and wipes it
   */
  stopRecognitionStream() {
    if (recognizeStream) {
      recognizeStream.end();
    }
    recognizeStream = null;
  },
  /**
   * Receives streaming data and writes it to the recognizeStream for transcription
   *
   * @param {Buffer} data A section of audio data
   */
  receiveData(data) {
    if (recognizeStream) {
      recognizeStream.write(data);
    }
  },
};
