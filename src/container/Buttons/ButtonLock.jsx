import React from "react";
import PropType from "prop-types";

function ButtonLock(prop) {
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

export default ButtonLock;

ButtonLock.PropType = {
  name: PropType.string.isRequired,
};
