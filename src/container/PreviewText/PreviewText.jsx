import React from "react";
import PropTypes from "prop-types";

const PreviewText = (prop) => {
  const { name } = prop;
  return <div>안녕하세요 {name}</div>;
};

export default PreviewText;

PreviewText.PropType = {
  name: PropTypes.string.isRequired,
};
