const speech = require("@google-cloud/speech");

let recognizeStream = null;

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
        console.log(
          "[RecognizeStream]: Got data:>>",
          data.results[0].alternatives
        );
        client.emit("speechData", data);

        // if end of utterance, let's restart stream
        // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
        if (data.results[0] && data.results[0].isFinal) {
          this.stopRecognitionStream();
          this.startRecognitionStream(client, request);
          // console.log('restarted stream serverside');
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
