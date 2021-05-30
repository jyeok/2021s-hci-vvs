const fetch = require("node-fetch");

function compressParagraph(questionInput) {
  return (
    fetch("http://svc.saltlux.ai:31781", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "69477979-4494-49c4-8533-d23d70d17872",
        serviceId: "00116013830",
        argument: {
          question: questionInput,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const datakey = data.return_object.keylists;
        const keylist = datakey.map((e) => e.keyword);
        console.log(keylist);
        return keylist;
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log("error: ", error))
  );
}

compressParagraph("오늘은 날씨가 화창할 것입니다. 강수 확률은 10%입니다.");
// const fetch = require("node-fetch");

// fetch("http://svc.saltlux.ai:31781", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     key: "69477979-4494-49c4-8533-d23d70d17872",
//     serviceId: "00116013830",
//     argument: {
//       question: "오늘은 날씨가 화창할 것입니다. 강수 확률은 10%입니다.",
//     },
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     const datakey = data.return_object.keylists;
//     console.log(datakey);
//   })
//   .catch((error) => console.log("error: ", error));
