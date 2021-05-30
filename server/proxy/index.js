const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(
  "/",
  createProxyMiddleware({
    target: "http://svc.saltlux.ai:31781",
    changeOrigin: true,
    secure: false,
    onProxyRes(proxyRes) {
      // eslint-disable-next-line no-param-reassign
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
  })
);

app.listen(3001);
