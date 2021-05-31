const express = require("express");
const cors = require("cors");

const { main } = require("./src/uploadFile");

const app = express();
const port = 3002;

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

app.listen(port);
