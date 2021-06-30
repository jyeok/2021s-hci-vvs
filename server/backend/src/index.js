/* eslint-disable no-console */
require("dotenv").config();

const Koa = require("koa");
const Router = require("@koa/router");
const cors = require("@koa/cors");
const parser = require("koa-bodyparser");
const logger = require("koa-logger");

const { MRC, keyword } = require("./api/text");

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3001;
const mode = process.env.MODE || "dev";
const origin = mode === "dev" ? "*" : process.env.FRONTEND_ORIGIN;

router.post("MRC", "/api/question", MRC);
router.post("keywords", "/api/keywords", keyword);

app
  .use(logger())
  .use(parser())
  .use(
    cors({
      origin,
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);
