const fetch = require("node-fetch");

export const upload = (blob) => {
  console.log("upload blob :>> ", blob);
  return fetch("http://localhost:3002/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: blob,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("data :>> ", data);
    })
    .catch((error) => console.log("error: ", error));
};

export default { upload };
