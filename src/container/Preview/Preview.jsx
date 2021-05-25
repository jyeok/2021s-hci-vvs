import React from "react";
import PropTypes from "prop-types";

const Preview = (props) => {
  const { isLocked, name } = props;

  return isLocked ? <div> 잠금 </div> : <div> {name} 열림 </div>;
};

export default Preview;

Preview.propTypes = {
  isLocked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};
