const fetch = require("node-fetch");

export const upload = async (chunks, dataType, codecs, encoding) => {
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

  console.log("data :>> ", data);
  return data;
};

export default { upload };
