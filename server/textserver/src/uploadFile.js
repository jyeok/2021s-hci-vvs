/* eslint-disable */

const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const destFileName = "record";
const bucketName = "2021s-hci-vvs";

async function saveFile(blob) {
  console.log("blob :>> ", blob);
  // fs.writeFile("voice.wav", chunks, "base64", (err) =>
  //   console.log("err :>> ", err)
  // );
}

async function upload(data) {
  const storage = new Storage();
  const myBucket = storage.bucket(bucketName);
  const file = myBucket.file(destFileName);
  file.save(data);
}

module.exports = {
  saveFile,
  upload,
};
