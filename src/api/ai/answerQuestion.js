const fetch = require("node-fetch");
require("dotenv").config();

export const answerQuestion = (sampleParagraph, sampleQuestion) =>
  fetch("http://localhost:3001", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: process.env.SALTLUX_API_KEY,
      serviceId: "01196851139",
      argument: {
        paragraph: sampleParagraph,
        question: sampleQuestion,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { answer } = data.result;
      const answerIndex = data.result.answer_index;
      const answersToQuestion = [answer, answerIndex];
      return answersToQuestion;
    })
    // eslint-disable-next-line no-console
    .catch((error) => console.log("error: ", error));

export default {
  answerQuestion,
};
