const postProcess = (results, endTime) => {
  const textBlockInputs = results.map((r) => {
    const start = r.words[0].startTime.seconds;
    const end = r.words[r.words.length - 1].endTime.seconds;
    const during = end - start;

    const result = {
      isHighlighted: 0,
      isModified: 0,
      reliability: r.confidence,
      start: Number.parseFloat((endTime / 1000 - during).toFixed(2)),
      end: Number.parseFloat((endTime / 1000).toFixed(2)),
      isMine: 0,
      content: r.transcript,
    };

    return result;
  });

  return textBlockInputs[0];
};

module.exports = {
  postProcess,
};
