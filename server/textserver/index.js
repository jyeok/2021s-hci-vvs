const express = require("express");
const cors = require("cors");

const app = express();
const port = 3002;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, { cors: { oriign: "*" } });

const realtimePort = 3003;

const { main } = require("./src/uploadFile");
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

  socket.on("startRecord", () => {
    console.log("[index] Start record");
    streamingSTT.main(io);
  });

  socket.on("endRecord", () => {
    console.log("[index] end record");
    streamingSTT.stopRecognitionStream();
  });

  socket.on("disconnect", () => {
    console.log("[index] disconnect");
    streamingSTT.stopRecognitionStream();
  });
});

httpServer.listen(realtimePort);
app.listen(port);
