import axios from "axios";

const answerQuestion = async (contents, question) => {
  try {
    const res = await axios.post("/api/question", {
      paragraph: contents,
      question,
    });

    return res.data;
  } catch (error) {
    return "";
  }
};

export default answerQuestion;
