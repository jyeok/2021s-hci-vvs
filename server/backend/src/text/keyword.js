const axios = require("axios");

const keyword = async (ctx) => {
  const { question } = ctx.request.body;

  const url = "http://svc.saltlux.ai:31781";

  const data = {
    key: process.env.SALTLUX_API_KEY,
    serviceId: "00116013830",
    argument: {
      question,
    },
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    transformResponse: (res) => {
      const parsed = JSON.parse(res);
      if (!parsed) return [];

      const keywords = parsed.return_object.keylists;

      const tags = keywords
        ? keywords.map((e) =>
            e.keyword.startsWith("#")
              ? e.keyword.trim()
              : `#${e.keyword.trim()}`
          )
        : [];

      return tags;
    },
  };

  const res = await axios.post(url, data, config);
  ctx.body = res.data;
};

module.exports = keyword;
