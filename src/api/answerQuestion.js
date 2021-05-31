const fetch = require("node-fetch");

export function answerQuestion(sampleParagraph, sampleQuestion) {
  return (
    fetch("http://localhost:3001", {
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
        // eslint-disable-next-line no-alert
        alert(answer);
        return answersToQuestion;
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log("error: ", error))
  );
}

export default answerQuestion;
