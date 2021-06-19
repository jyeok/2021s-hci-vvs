/* eslint-disable */

"use strict";

const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "ko-KR";
const streamingLimit = 2900000; // ms - set to low number for demo purposes

function main(client) {
  const chalk = require("chalk");
  const { Writable } = require("stream");
  const recorder = require("node-record-lpcm16");

  const speech = require("@google-cloud/speech").v1p1beta1;

  const config = {
    encoding,
    sampleRateHertz,
    languageCode,
    enableAutomaticPunctuation: true,
    enableWordTimeOffsets: true,
    streamingLimit,
  };

  const request = {
    config,
    interimResults: true,
  };

  let recognizeStream = null;
  let restartCounter = 0;
  let audioInput = [];
  let lastAudioInput = [];
  let resultEndTime = 0;
  let isFinalEndTime = 0;
  let finalRequestEndTime = 0;
  let newStream = true;
  let bridgingOffset = 0;
  let lastTranscriptWasFinal = false;

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

  function startStream(client) {
    const speechClient = new speech.SpeechClient();
    // Clear current audioInput
    audioInput = [];
    // Initiate (Reinitiate) a recognize stream
    recognizeStream = speechClient
      .streamingRecognize(request)
      .on("error", (err) => {
        console.error(
          `Error when processing audio: ${
            err && err.code ? `Code: ${err.code} ` : ""
          }${err && err.details ? err.details : ""}`
        );
        client.emit("googleCloudStreamError", err);
      })
      .on("data", (data) => speechCallback(data, client));

    // Restart stream when streamingLimit expires
    setTimeout(restartStream, streamingLimit);
  }

  const speechCallback = (stream, client) => {
    // Convert API result end time from seconds + nanoseconds to milliseconds
    resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    // Calculate correct time based on offset from audio sent twice
    const correctedTime =
      resultEndTime - bridgingOffset + streamingLimit * restartCounter;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    let stdoutText = "";
    if (stream.results[0] && stream.results[0].alternatives[0]) {
      stdoutText =
        correctedTime + ": " + stream.results[0].alternatives[0].transcript;
    }

    if (stream.results[0].isFinal) {
      process.stdout.write(chalk.green(`${stdoutText}\n`));

      isFinalEndTime = resultEndTime;
      lastTranscriptWasFinal = true;

      client.emit("speechData", postProcessing(stream.results[0].alternatives));
    } else {
      // Make sure transcript does not exceed console character length
      if (stdoutText.length > process.stdout.columns) {
        stdoutText =
          stdoutText.substring(0, process.stdout.columns - 4) + "...";
      }
      process.stdout.write(chalk.red(`${stdoutText}`));

      lastTranscriptWasFinal = false;
    }
  };

  const audioInputStreamTransform = new Writable({
    write(chunk, encoding, next) {
      if (newStream && lastAudioInput.length !== 0) {
        // Approximate math to calculate time of chunks
        const chunkTime = streamingLimit / lastAudioInput.length;
        if (chunkTime !== 0) {
          if (bridgingOffset < 0) {
            bridgingOffset = 0;
          }
          if (bridgingOffset > finalRequestEndTime) {
            bridgingOffset = finalRequestEndTime;
          }
          const chunksFromMS = Math.floor(
            (finalRequestEndTime - bridgingOffset) / chunkTime
          );
          bridgingOffset = Math.floor(
            (lastAudioInput.length - chunksFromMS) * chunkTime
          );

          for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
            recognizeStream.write(lastAudioInput[i]);
          }
        }
        newStream = false;
      }

      audioInput.push(chunk);

      if (recognizeStream) {
        recognizeStream.write(chunk);
      }

      next();
    },

    final() {
      if (recognizeStream) {
        recognizeStream.end();
      }
    },
  });

  function restartStream() {
    if (recognizeStream) {
      recognizeStream.end();
      recognizeStream.removeListener("data", speechCallback);
      recognizeStream = null;
    }
    if (resultEndTime > 0) {
      finalRequestEndTime = isFinalEndTime;
    }
    resultEndTime = 0;

    lastAudioInput = [];
    lastAudioInput = audioInput;

    restartCounter++;

    if (!lastTranscriptWasFinal) {
      process.stdout.write("\n");
    }
    process.stdout.write(
      chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
    );

    newStream = true;

    startStream();
  }

  // Start recording and send the microphone input to the Speech API
  recorder
    .record({
      sampleRateHertz: 16000,
      threshold: 0, // Silence threshold
      silence: 200,
      keepSilence: true,
      recordProgram: "sox", // Try also "arecord" or "sox"
    })
    .stream()
    .on("error", (err) => {
      console.error("Audio recording error " + err);
    })
    .pipe(audioInputStreamTransform);

  console.log("");
  console.log("Listening, press Ctrl+C to stop.");
  console.log("");
  console.log("End (ms)       Transcript Results/Status");
  console.log("=========================================================");

  startStream(client);
}

process.on("unhandledRejection", (err) => {
  console.error(err.message);
  process.exitCode = 1;
});

module.exports = { main };
