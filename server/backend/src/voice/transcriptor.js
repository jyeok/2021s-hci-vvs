/* eslint-disable no-console */

const { Writable, Readable } = require("stream");
const chalk = require("chalk");
const speech = require("@google-cloud/speech").v1p1beta1;

const { postProcess } = require("./util");
const { SPEECH } = require("./constants");

const DEBUG = false;

class Transcriptor {
  constructor(client) {
    if (DEBUG) console.log("Constructor");

    this.client = client;
    this.sid = null;

    this.transformWrite = this.transformWrite.bind(this);
    this.transformEnd = this.transformEnd.bind(this);
    this.speechCallback = this.speechCallback.bind(this);
    this.loadData = this.loadData.bind(this);
    this.restartStream = this.restartStream.bind(this);
    this.startStream = this.startStream.bind(this);
    this.endStream = this.endStream.bind(this);

    this.config = {
      encoding: "LINEAR16",
      sampleRateHertz: 48000,
      languageCode: "ko-KR",
      streamingLimit: 290000,
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
    };

    this.request = {
      config: this.config,
      interimResults: true,
    };

    this.times = {
      resultEndTime: 0,
      isFinalEndTime: 0,
      finalRequestEndTime: 0,
      bridgingOffset: 0,
    };

    this.flags = {
      restartCounter: 0,
      newStream: true,
      lastTranscriptWasFinal: false,
    };

    this.inputs = {
      audioInput: [],
      lastAudioInput: [],
    };

    this.streams = {
      voiceStream: new Readable({
        read() {},
      }),
      speechStream: null,
      transform: new Writable({
        write: this.transformWrite,
        final: this.transformEnd,
      }),
    };

    console.log("");
    console.log("Listening, press Ctrl+C to stop.");
    console.log("");
    console.log("End (ms)       Transcript Results/Status");
    console.log("=========================================================");

    if (DEBUG) console.log("Constructor End");
  }

  transformWrite(chunk, _, next) {
    if (this.newStream && this.inputs.lastAudioInput.length !== 0) {
      const chunkTime =
        this.config.streamingLimit / this.inputs.lastAudioInput.length;

      if (chunkTime > 0) {
        if (this.times.bridgingOffset < 0) this.times.bridgingOffset = 0;
        if (this.times.bridgingOffset > this.times.finalRequestEndTime)
          this.times.bridgingOffset = this.times.finalRequestEndTime;
      }

      const chunksFromMS = Math.floor(
        (this.times.finalRequestEndTime - this.times.bridgingOffset) / chunkTime
      );

      this.times.bridgingOffset = Math.floor(
        (this.inputs.lastAudioInput.length - chunksFromMS) * chunkTime
      );

      for (
        let i = chunksFromMS;
        i < this.inputs.lastAudioInput.length;
        i += 1
      ) {
        this.streams.speechStream.write(this.inputs.lastAudioInput[i]);
      }

      this.flags.newStream = false;
    }

    this.inputs.audioInput.push(chunk);

    if (this.streams.speechStream) this.streams.speechStream.write(chunk);

    next();
  }

  transformEnd() {
    if (DEBUG) console.log("end");
    if (this.streams.speechStream) this.streams.speechStream.end();
  }

  speechCallback(stream) {
    if (DEBUG) console.log("callback");
    let stdoutText = "";

    this.times.resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    const correctedTime =
      this.times.resultEndTime -
      this.times.bridgingOffset +
      this.config.streamingLimit * this.flags.restartCounter;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (stream.results[0] && stream.results[0].alternatives[0]) {
      stdoutText = `${correctedTime}: ${stream.results[0].alternatives[0].transcript}`;
    }

    if (stream.results[0].isFinal) {
      const textBlockData = postProcess(
        stream.results[0].alternatives,
        correctedTime
      );
      process.stdout.write(chalk.green(`${stdoutText}\n`));
      process.stdout.write("\n");
      console.log(textBlockData);

      this.times.isFinalEndTime = this.times.resultEndTime;
      this.flags.lastTranscriptWasFinal = true;
      this.client.emit(SPEECH.SPEECH_DATA, textBlockData);
    } else {
      if (stdoutText.length > process.stdout.columns) {
        stdoutText = `${stdoutText.substring(
          0,
          process.stdout.columns - 4
        )}...`;
      }

      process.stdout.write(chalk.red(stdoutText));
      this.client.emit(
        SPEECH.SPEECH_INTERIM_DATA,
        stream.results[0].alternatives[0].transcript
      );
      this.flags.lastTranscriptWasFinal = false;

      if (DEBUG) console.log("callback end");
    }
  }

  loadData(data) {
    if (this.streams.voiceStream) this.streams.voiceStream.push(data);
  }

  restartStream() {
    if (DEBUG) console.log("restart");
    this.streams.voiceStream.unpipe();

    this.streams.speechStream.removeAllListeners();
    this.streams.speechStream.end(); // Destroy?

    if (this.times.resultEndTime > 0) {
      this.times.finalRequestEndTime = this.times.isFinalEndTime;
    }

    this.inputs.lastAudioInput = [];
    this.inputs.audioInput = [];
    this.times.resultEndTime = 0;
    this.flags.restartCounter += 1;

    if (!this.flags.lastTranscriptWasFinal) {
      process.stdout.write("\n");
    }

    process.stdout.write(
      chalk.yellow(
        `${
          this.config.streamingLimit * this.flags.restartCounter
        }: RESTARTING REQUEST\n`
      )
    );

    this.flags.newStream = true;
    clearTimeout(this.sid);
    this.startStream();

    if (DEBUG) console.log("restart end");
  }

  endStream() {
    if (DEBUG) console.log("stream end");

    this.streams.voiceStream.removeAllListeners();
    this.streams.voiceStream.destroy();

    this.streams.transform.removeAllListeners();
    this.streams.transform.destroy();

    this.streams.speechStream.removeAllListeners();
    this.streams.speechStream.destroy();

    clearTimeout(this.sid);

    if (DEBUG) console.log("stream end of end");
  }

  startStream() {
    if (DEBUG) console.log("start");
    const speechClient = new speech.SpeechClient();
    this.sid = setTimeout(this.restartStream, this.config.streamingLimit);

    this.streams.voiceStream.pipe(this.streams.transform);
    this.streams.voiceStream.resume();

    this.streams.speechStream = speechClient.streamingRecognize(this.request);

    this.streams.speechStream
      .on("error", (err) => {
        console.error(err);
        this.client.emit(SPEECH.TRANSCRIPT_ERROR, err);
      })
      .on("data", (data) => {
        this.speechCallback(data);
      });

    if (DEBUG) console.log("start end");
  }
}

process.on("unhandledRejection", (err) => {
  console.error(err.message);
  process.exitCode = 1;
});

module.exports = Transcriptor;
