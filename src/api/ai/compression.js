const fetch = require("node-fetch");
require("dotenv").config();

export const compression = (input) =>
  fetch("http://localhost:3001", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: process.env.SALTLUX_API_KEY,
      serviceId: "00116013830",
      argument: {
        question: input,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => data);

export default {
  compression,
};
