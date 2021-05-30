const fetch = require("node-fetch");

function answerQuestion(sampleParagraph, sampleQuestion) {
  return (
    fetch("http://svc.saltlux.ai:31781", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "69477979-4494-49c4-8533-d23d70d17872",
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
      .catch((error) => console.log("error: ", error))
  );
}

const paragraph =
  "올시즌 맹활약을 펼치고 있는 이동국(전북)이 지도자 교육을 받는다. 이동국은 15일부터 파주NFC에서 진행되는 아시아축구연맹(AFC) A급 지도자 강습회에 참가한다. 이동국은 15일 지도자 강습회에 앞서 '시즌을 앞두고 코치진과 상의한 상황이다. 코로나19로 일정이 연기되면서 2경기를 못뛰게 됐다'며 '선수 생활을 할 때 지도자의 생각이나 어떤 것을 원하는지 알 수 있는 시간이 될 것'이라고 말했다. 이어 '현역 생활을 하면서 지도자 공부를 하는 것이 선수 생활에 도움이 될 것이라고 생각한다. 지도자들의 고충을 알 수 있는 시간이 될 것'이라고 덧붙였다. 이동국은 플레잉코치 가능성에 대해선 '플레잉코치는 들어본 적이 없고 공식적으로 인정받는 직책이 아니다. 선수면 선수, 코치면 코치로 열심히 할 것'이라고 전했다. 이동국은 올시즌 K리그 4경기에 출전해 4골을 터트리며 소속팀 전북의 선두 질주를 이끌고 있다. 이동국은 '컨디션이 좋은 상황에서 2경기를 쉬어 아쉽지만 2경기 만큼 좋은 경험을 가지고 간다는 생각'이라며 '1주일에 1경기를 치러 체력 안배가 되고 있고 전술적으로 동료들에게 많은 도움을 받고 있다'는 뜻을 나타냈다.";
const question = "이동국이 소속된 팀은?";
answerQuestion(paragraph, question);

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
