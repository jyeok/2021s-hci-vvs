const axios = require("axios");

export const compression = async (contents) => {
  try {
    const res = await axios.post("/api/compression", {
      question: contents,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export default {
  compression,
};
