import axios from "axios";

const fileUpload = async (fileName, data, user = "root") => {
  try {
    const res = await axios.post("/api/upload", {
      fileName,
      data,
      user,
    });
    return res.data;
  } catch (error) {
    return "";
  }
};

export default fileUpload;
