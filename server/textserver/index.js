const express = require("express");
const cors = require("cors");

const app = express();
const port = 3002;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, { cors: { oriign: "*" } });

const realtimePort = 3003;

const { main } = require("./src/uploadFile");
const speechToTextUtils = require("./src/SpeechToText");
const streamingSTT = require("./src/streamingSTT");

app.use(cors()).use(
  express.json({
    limit: "300mb",
  })
);

app.post("/upload", async (req, res) => {
  const result = await main(
    req.body.chunks,
    req.body.dataType,
    req.body.codecs,
    req.body.encoding
  );

  res.send(result);
});

io.on("connection", (socket) => {
  console.log("New connection!");

  socket.on("startGoogleCloudStream", (request) => {
    console.log("starting google cloud stream...");
    speechToTextUtils.startRecognitionStream(io, request);
  });

  // Receive audio data
  socket.on("binaryAudioData", (data) => {
    speechToTextUtils.receiveData(data);
  });

  // End the audio stream
  socket.on("endGoogleCloudStream", () => {
    speechToTextUtils.stopRecognitionStream();
    console.log("end google cloud stream...");
  });

  socket.on("startRecord", () => {
    console.log("[index] Start record");
    streamingSTT.main(io);
  });
});

httpServer.listen(realtimePort);
app.listen(port);
