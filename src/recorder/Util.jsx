import { getTextBlocks } from "api/ai/simpleTTS";
import fileUpload from "api/ai/storage";
import { RECORD_STATUS } from "./constants";

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

export const secondsToTime = (seconds) => {
  const hms = new Date(seconds * 1000).toISOString().substr(11, 8);
  const [h, m, s] = hms.split(":").map((e) => Number.parseInt(e, 10));

  return h === 0 ? `${m}분 ${s}초` : `${h}시 ${m}분 ${s}초`;
};

export const f32toi16 = (buffer) => {
  if (!buffer) return buffer;

  let l = buffer.length - 1;
  const buf = new Int16Array(l);

  while (l) {
    buf[l] = buffer[l] * 0xffff;
    l -= 1;
  }

  return buf.buffer;
};

export const statusToBackground = (status) => {
  let color;

  if (status === RECORD_STATUS.RECORDING) color = "orange";
  else if (status === RECORD_STATUS.READY) color = "skyblue";
  else if (status === RECORD_STATUS.ERROR) color = "red";
  else color = "white";

  return {
    backgroundColor: color,
    border: "1px solid",
  };
};

export const uploadVoice = async (title, data, user) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("data", data);
  formData.append("user", user);

  return fileUpload(formData);
};

export default {
  generateTextBlock,
  splitBase64String,
  secondsToTime,
  f32toi16,
  statusToBackground,
  uploadVoice,
};
