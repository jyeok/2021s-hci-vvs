const axios = require("axios");

const MRC = async (ctx) => {
  const { paragraph, question } = ctx.request.body;

  const url = "http://svc.saltlux.ai:31781";
  const data = {
    key: process.env.SALTLUX_API_KEY,
    serviceId: "01196851139",
    argument: {
      paragraph,
      question,
    },
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    transformResponse: (res) => {
      const parsed = JSON.parse(res);
      const { answer } = parsed.result;

      return answer;
    },
  };

  const res = await axios.post(url, data, config);
  ctx.body = res.data;
};

module.exports = MRC;
