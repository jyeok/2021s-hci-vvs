/* eslint-disable no-console */

const encoding = "LINEAR16";
const sampleRateHertz = 48000;
const languageCode = "ko-KR";
const streamingLimit = 290000; // ms - set to low number for demo purposes
const chalk = require("chalk");
const { Writable, Readable } = require("stream");
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

let recordStream = new Readable({ read: () => {} });
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

const audioInputStreamTransform = new Writable({
  write(chunk, _, next) {
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

        for (let i = chunksFromMS; i < lastAudioInput.length; i += 1) {
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

const postProcess = (results, endTime) => {
  const textBlockInputs = results.map((r) => {
    const start = r.words[0].startTime.seconds;
    const end = r.words[r.words.length - 1].endTime.seconds;
    const during = end - start;

    const result = {
      isHighlighted: 0,
      isModified: 0,
      reliability: r.confidence,
      start: endTime / 1000 - during,
      end: endTime / 1000,
      isMine: 0,
      content: r.transcript,
    };

    return result;
  });

  return textBlockInputs;
};

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
    stdoutText = `${correctedTime}: ${stream.results[0].alternatives[0].transcript}`;
  }

  if (stream.results[0].isFinal) {
    process.stdout.write(chalk.green(`${stdoutText}\n`));

    isFinalEndTime = resultEndTime;
    lastTranscriptWasFinal = true;

    const textBlockData = postProcess(
      stream.results[0].alternatives,
      correctedTime
    );

    console.log(textBlockData);

    client.emit("speechData", textBlockData);
  } else {
    // Make sure transcript does not exceed console character length
    if (stdoutText.length > process.stdout.columns) {
      stdoutText = `${stdoutText.substring(0, process.stdout.columns - 4)}...`;
    }
    process.stdout.write(chalk.red(`${stdoutText}`));

    client.emit("interimData", stream.results[0].alternatives[0].transcript);

    lastTranscriptWasFinal = false;
  }
};

const main = (client) => {
  function startStream() {
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
        client.emit("recordError", err);
      })
      .on("data", (data) => speechCallback(data, client));

    // Restart stream when streamingLimit expires
    // eslint-disable-next-line no-use-before-define
    setTimeout(restartStream, streamingLimit);
  }

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

    restartCounter += 1;

    if (!lastTranscriptWasFinal) {
      process.stdout.write("\n");
    }
    process.stdout.write(
      chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
    );

    newStream = true;

    startStream();
  }

  if (!recordStream) recordStream = new Readable({ read: () => {} });

  recordStream
    .on("error", (err) => {
      console.error(`Audio recording error ${err}`);
      client.emit("recordError", err);
    })
    .pipe(audioInputStreamTransform);

  console.log("");
  console.log("Listening, press Ctrl+C to stop.");
  console.log("");
  console.log("End (ms)       Transcript Results/Status");
  console.log("=========================================================");

  startStream();
};

function loadData(data) {
  if (recordStream) {
    recordStream.push(data);
  }
}

const stopRecognitionStream = () => {
  if (recognizeStream) {
    recognizeStream.end();
    recognizeStream.removeAllListeners();
    recognizeStream.destroy();
  }

  if (recordStream) {
    recordStream.removeAllListeners();
    recordStream.destroy();
  }

  recordStream = null;
  recognizeStream = null;
  restartCounter = 0;
  audioInput = [];
  lastAudioInput = [];
  resultEndTime = 0;
  isFinalEndTime = 0;
  finalRequestEndTime = 0;
  newStream = true;
  bridgingOffset = 0;
  lastTranscriptWasFinal = false;
};

process.on("unhandledRejection", (err) => {
  console.error(err.message);
  process.exitCode = 1;
});

module.exports = { main, stopRecognitionStream, loadData };
