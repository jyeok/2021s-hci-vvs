/* eslint-disable no-console */

const Koa = require("koa");
const Router = require("@koa/router");
const cors = require("@koa/cors");

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3005;
const mode = process.env.MODE || "dev";
const origin = mode === "dev" ? "*" : process.env.FRONTEND_ORIGIN;

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
  .use(
    cors({
      origin,
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port);
