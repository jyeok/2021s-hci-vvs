const fetch = require("node-fetch");

export const getTextBlocks = async (chunks, dataType, codecs, encoding) => {
  const data = await fetch("http://localhost:3002/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chunks,
      dataType,
      codecs,
      encoding,
    }),
  }).then((response) => response.json());

  return data;
};

export default getTextBlocks;
