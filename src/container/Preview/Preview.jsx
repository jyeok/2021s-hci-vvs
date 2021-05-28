import React from "react";
import PropType from "prop-types";
import { Button } from "@material-ui/core";
import MessageHolder from "../MessageHolder/MessageHolder";

function Preview() {
  const pstyle = {
    marginLeft: "12px",
    marginBottom: "8px",
  };
  const pborder = {
    border: "0.5px solid",
  };
  return (
    <div>
      Preview
      <div style={{ border: "1px solid", margin: "5px", height: "400px" }}>
        <MessageHolder />
      </div>
      <div style={pstyle}>
        <Button type="button" style={pborder}>
          편집
        </Button>
      </div>
      <div style={pstyle}>
        <Button type="button" style={pborder}>
          재생
        </Button>
      </div>
      <div style={pstyle}>
        <Button type="button" style={pborder}>
          잠금
        </Button>
      </div>
    </div>
  );
}
export default Preview;

Preview.propType = {
  name: PropType.string.isRequired,
};
