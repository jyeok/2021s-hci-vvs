const Bucket = process.env.BUCKET_NAME || "jyeok-record-storage";
const Region = process.env.AWS_REGION || "ap-northeast-2";

module.exports = {
  Bucket,
  Region,
};
