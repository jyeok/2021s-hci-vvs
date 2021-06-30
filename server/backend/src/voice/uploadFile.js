/* eslint-disable */

const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");
const fs = require("fs");

const destFileName = "record";
const bucketName = "2021s-hci-vvs";
const filePath = "voice.bin";

const uri = `gs://${bucketName}/${destFileName}`;

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

async function main(chunks, dataType, codecs, encoding) {
  await saveFile(chunks, dataType, codecs, encoding);
  await upload();

  const textBlockData = await simpleTTS();
  console.log("[main]: textBlockData] :>> ", textBlockData);

  return textBlockData;
}

function saveFile(chunks, dataType, codecs, encoding) {
  fs.writeFile(filePath, chunks, "base64", (err) => {
    if (err) {
      console.log("Error on Saving File! :>> ", err);
    }
  });
}
``;

function upload() {
  const storage = new Storage();

  async function uploadFile() {
    await storage.bucket(bucketName).upload(filePath, {
      destination: destFileName,
    });

    console.log(`${filePath} uploaded to ${bucketName}`);
  }

  uploadFile().catch(console.error);
}

async function simpleTTS() {
  const client = new speech.SpeechClient();
  const gcsUri = uri;
  const encoding = "opus";
  const sampleRateHertz = 48000;
  const languageCode = "ko-KR";

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    enableAutomaticPunctuation: true,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 2,
    enableWordTimeOffsets: true,
  };
  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();

  const results = response.results.map((r) => r.alternatives[0]);

  return postProcessing(results);
}

module.exports = {
  main,
};
