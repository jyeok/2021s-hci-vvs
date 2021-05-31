const express = require("express");
const cors = require("cors");

const { saveFile } = require("./src/uploadFile");

const app = express();
const port = 3002;

app.use(cors()).use(express.json());

app.post("/upload", (req, res) => {
  console.log("req :>> ", req.body);
  // saveFile(req.body);
  res.send("bye");
});

app.listen(port);
