/* eslint-disable no-console */
require("dotenv").config();

const Koa = require("koa");
const Router = require("@koa/router");

const cors = require("@koa/cors");

const axios = require("axios");

const app = new Koa();
const router = new Router();
const parser = require("koa-bodyparser");

const logger = require("koa-logger");

const port = process.env.PORT || 3001;
const mode = process.env.MODE || "dev";
const origin = mode === "dev" ? "*" : process.env.FRONTEND_ORIGIN;

router.post("MRC", "/api/question", async (ctx) => {
  const { paragraph, question } = ctx.request.body;

  const url = "http://svc.saltlux.ai:31781";
  const data = {
    key: process.env.SALTLUX_API_KEY,
    serviceId: "01196851139",
    argument: {
      paragraph,
      question,
    },
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    transformResponse: (res) => {
      const parsed = JSON.parse(res);
      const { answer } = parsed.result;

      return answer;
    },
  };

  const res = await axios.post(url, data, config);
  ctx.body = res.data;
});

router.post("compression", "/api/compression", async (ctx) => {
  const { question } = ctx.request.body;

  const url = "http://svc.saltlux.ai:31781";

  const data = {
    key: process.env.SALTLUX_API_KEY,
    serviceId: "00116013830",
    argument: {
      question,
    },
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    transformResponse: (res) => {
      const parsed = JSON.parse(res);
      const keywords = parsed.return_object.keylists;

      const tags = keywords
        ? keywords.map((e) =>
            e.keyword.startsWith("#")
              ? e.keyword.trim()
              : `#${e.keyword.trim()}`
          )
        : [];

      return tags;
    },
  };

  const res = await axios.post(url, data, config);
  ctx.body = res.data;
});

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
