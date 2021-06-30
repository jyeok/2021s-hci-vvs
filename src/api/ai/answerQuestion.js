const axios = require("axios");

export const answerQuestion = async (contents, question) => {
  try {
    const res = await axios.post("/api/question", {
      paragraph: contents,
      question,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export default {
  answerQuestion,
};
