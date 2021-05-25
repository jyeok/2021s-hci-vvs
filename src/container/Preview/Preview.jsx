import React from "react";
import PropType from "prop-types";
import Button from "@material-ui/core/Button";
import PreviewText from "container/PreviewText/PreviewText";

function Preview(prop) {
  const { name } = prop;
  return (
    <div>
      {name}
      <PreviewText name={name} />
      <div>
        <Button type="button">편집</Button>
      </div>
      <div>
        <Button type="button">재생</Button>
      </div>
      <div>
        <Button type="button">잠금</Button>
      </div>
    </div>
  );
}
export default Preview;
// const Preview = (prop) => {
//   const { name } = prop;

//   return (
//     <div>
//       {name}
//       <PreviewText name="대화 미리보기" />
//       <div>
//         <Button type="button">편집</Button>
//       </div>
//       <div>
//         <Button type="button">재생</Button>
//       </div>
//       <div>
//         <Button type="button">잠금</Button>
//       </div>
//     </div>
//   );
// };

// export default Preview;

Preview.propType = {
  name: PropType.string.isRequired,
};
