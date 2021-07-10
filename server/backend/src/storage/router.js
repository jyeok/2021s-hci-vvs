const { getFileList, getFile, deleteFile, uploadFile } = require("./operation");

const files = async (ctx) => {
  const { user = "root " } = ctx.params;

  const res = await getFileList(user);

  if (res) {
    ctx.body = res;
  } else {
    ctx.body = [];
  }
};

const file = async (ctx) => {
  const { user = "root", key: fileName } = ctx.params;

  const res = await getFile(fileName, user);
  ctx.body = res || {};
};

const upload = async (ctx) => {
  const { user, fileName, data } = ctx.request.body;

  const res = await uploadFile(fileName, data, user);

  ctx.body = res || "Failed";
};

const remove = async (ctx) => {
  const { user = "root", fileName } = ctx.request.body;

  const success = await deleteFile(fileName, user);

  ctx.body = success ? "Done" : "Failed";
};

module.exports = {
  files,
  file,
  upload,
  remove,
};
