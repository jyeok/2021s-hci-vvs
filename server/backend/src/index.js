/* eslint-disable no-console */

require("dotenv").config();

const http = require("http");

const Koa = require("koa");
const Router = require("@koa/router");
const formidable = require("koa2-formidable");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const logger = require("koa-logger");

const { MRC, keyword } = require("./text");
const { upload, files, remove, file } = require("./storage");

const speechServer = require("./socket");

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

speechServer(server, { origin });

server.listen(port, () => {
  console.log(
    `🚀 Server is ready at: ${
      process.env.FRONTEND_ORIGIN || `http://localhost:${port}`
    }`
  );
});
