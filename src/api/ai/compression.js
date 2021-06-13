const fetch = require("node-fetch");

export const compression = (input) =>
  fetch("http://localhost:3001", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: "69477979-4494-49c4-8533-d23d70d17872",
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
