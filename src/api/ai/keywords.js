import axios from "axios";

const keywords = async (contents) => {
  try {
    const res = await axios.post("/api/keywords", {
      question: contents,
    });

    return res.data;
  } catch (error) {
    return "";
  }
};

export default keywords;
