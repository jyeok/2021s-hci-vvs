/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

require("dotenv").config();

const http = require("http");
const _io = require("socket.io");

const Koa = require("koa");
const Router = require("@koa/router");
const formidable = require("koa2-formidable");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const logger = require("koa-logger");

const { MRC, keyword } = require("./text");
const { upload, files, remove, file } = require("./storage");
const streamingSTT = require("./voice/streamingSTT");
const transcript = require("./voice/transcript");

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3001;
const mode = process.env.MODE || "dev";
const origin = mode === "dev" ? "*" : process.env.FRONTEND_ORIGIN;

router.post("MRC", "/api/question", MRC);
router.post("keywords", "/api/keywords", keyword);

router.get("file", "/api/:user/file/:key", file);
router.get("files", "/api/:user/files", files);
router.post("upload", "/api/upload", upload);
router.post("remove", "/api/remove", remove);

app
  .use(logger())
  .use(formidable())
  .use(parser())
  .use(
    cors({
      origin,
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

const server = http.createServer(app.callback());
const io = _io(server, { cors: { origin } });

io.on("connection", (socket) => {
  console.log(`New Client ${socket.id} Connected!`);

  socket.on("startRecord", () => {
    console.log("[Server] Record Started");
    streamingSTT.main(io);
  });

  socket.on("endRecord", () => {
    console.log("[Server] Record Ended");
    streamingSTT.stopRecognitionStream();
  });

  socket.on("disconnect", () => {
    console.log(`[Server] Client ${socket.id} disconnected!`);
    streamingSTT.stopRecognitionStream();
  });

  socket.on("recordStart", () => {
    console.log("[Server] Record Start");
    transcript.main(io);
  });

  socket.on("recordData", (data) => {
    transcript.loadData(data);
  });

  socket.on("recordEnd", () => {
    console.log("[Server] Record End");
    transcript.stopRecognitionStream();
  });
});

server.listen(port, () => {
  console.log(
    `🚀 Server is ready at: ${
      process.env.FRONTEND_ORIGIN || `http://localhost:${port}`
    }`
  );
});
