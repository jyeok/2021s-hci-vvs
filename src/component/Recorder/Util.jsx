import { getTextBlocks } from "api/ai/simpleTTS";

export const generateTextBlock = async (base64Data) => {
  const { data, dataType, codecs, encoding } = base64Data;
  const textBlocks = await getTextBlocks(data, dataType, codecs, encoding);

  return textBlocks;
};

export const splitBase64String = (base64String) => {
  const [dataType, codecs, encoding, data] = base64String.split(/;|,/);

  return {
    dataType,
    codecs,
    encoding,
    data,
  };
};

export const secondsToTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

export default {
  generateTextBlock,
  splitBase64String,
  secondsToTime,
};
