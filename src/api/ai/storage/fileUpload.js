import axios from "axios";

const fileUpload = async (data) => {
  try {
    const res = await axios({
      method: "post",
      url: "/api/upload",
      data,
    });
    return res.data;
  } catch (error) {
    return "";
  }
};

export default fileUpload;
