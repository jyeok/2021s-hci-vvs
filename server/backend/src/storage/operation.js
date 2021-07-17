/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable no-case-declarations */
const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Bucket, Region: region } = require("./config");

const client = new S3Client({
  region,
});

const getFileList = async (user = "root") => {
  try {
    const listObjectParams = {
      Bucket,
      Prefix: `records/${user}/`,
    };

    const fileList = await client.send(
      new ListObjectsV2Command(listObjectParams)
    );

    console.log("[getFileList] Files: ", fileList.Contents);

    return fileList.Contents;
  } catch (err) {
    console.log("[getFileList] Error: ", err);

    return null;
  }
};

const uploadFile = async (fileName, data, user = "root") => {
  const putObjectParams = {
    Bucket,
    // ContentType
    Key: `records/${user}/${fileName}`,
    Body: data,
  };

  try {
    const res = await client.send(new PutObjectCommand(putObjectParams));

    console.log("[uploadFile] Success: ", res);

    return `https://${Bucket}.s3.amazonaws.com/records/${user}/${fileName}`;
  } catch (err) {
    console.log("[uploadFile] Error: ", err);

    return null;
  }
};

const getFile = async (fileName, user = "root") => {
  const getObjectParams = {
    Bucket,
    Key: `records/${user}/${fileName}`,
  };

  try {
    const res = await client.send(new GetObjectCommand(getObjectParams));

    console.log("[getFile] Success: ", res.Body);
    return res.Body;
  } catch (err) {
    console.log("[getFile] Error: ", err);
    return null;
  }
};

const deleteFile = async (fileName, user = "root") => {
  const deleteObjectParams = {
    Bucket,
    Key: `records/${user}/${fileName}`,
  };

  try {
    const res = await client.send(new DeleteObjectCommand(deleteObjectParams));

    console.log("[deleteFile] Success: ", res);
    return true;
  } catch (err) {
    console.log("[deleteFile] Error: ", err);
    return false;
  }
};

if (process.argv.length >= 3) {
  switch (process.argv[2]) {
    case "list":
      getFileList();
      break;
    case "upload":
      const fs = require("fs");
      const path = require("path");

      if (!process.argv[3]) {
        console.log("File is required to upload");
        process.exit(-1);
      }

      const fileStream = fs.createReadStream(process.argv[3]);

      fileStream.on("error", (err) => console.log("File Error: ", err));

      const fileName = path.basename(process.argv[3]);
      const data = fileStream;

      uploadFile(fileName, data);
      break;
    case "get":
      getFile(process.argv[3]);
      break;
    case "delete":
      deleteFile(process.argv[3]);
      break;
    default:
      console.error(
        `Unknown Command ${process.argv[2]}. Possible options are: list, upload, get, delete`
      );
      process.exit(-1);
  }
}

module.exports = {
  getFileList,
  getFile,
  uploadFile,
  deleteFile,
};
