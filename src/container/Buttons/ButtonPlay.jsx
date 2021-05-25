import React from "react";
import PropType from "prop-types";

function ButtonPlay(prop) {
  const { name } = prop;
  const isPressed = () => console.log(name);
  return (
    <div>
      <button type="button" onClick={isPressed}>
        {name}
      </button>
    </div>
  );
}

export default ButtonPlay;

ButtonPlay.PropType = {
  name: PropType.string.isRequired,
};
