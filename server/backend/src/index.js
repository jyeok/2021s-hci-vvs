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

const port = process.env.PORT || 3005;
const mode = process.env.MODE || "dev";
const origin = mode === "dev" ? "*" : process.env.FRONTEND_ORIGIN;

router.post("MRC", "/api/question", async (ctx) => {
  const { paragraph, question } = ctx.request.body;

  const config = {
    method: "post",
    url: "http://svc.saltlux.ai:31781",
    data: {
      key: process.env.SALTLUX_API_KEY,
      serviceId: "01196851139",
      argument: {
        paragraph,
        question,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
    transformResponse: (data) => {
      const response = JSON.parse(data);
      const { answer } = response.result;

      return answer;
    },
  };

  const res = await axios(config);
  ctx.body = res.data;
});

router.get("main", "/", (ctx) => {
  ctx.body = "Hello!";
});

router.get("error", "/error", (ctx) => {
  ctx.throw(500, "Internal Server Error");
});

router.get("status", "/ok", (ctx) => {
  ctx.status = 200;
  ctx.body = "OK";
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(`error ${err.status}: ${err.message}`);

    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
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
