import React from "react";
import PropType from "prop-types";

function ButtonEdit(prop) {
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

export default ButtonEdit;

ButtonEdit.PropType = {
  name: PropType.string.isRequired,
};
