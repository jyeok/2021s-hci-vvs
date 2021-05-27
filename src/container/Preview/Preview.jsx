import React from "react";
import PropType from "prop-types";
import { Button } from "@material-ui/core";
import PreviewText from "container/PreviewText/PreviewText";

function Preview(prop) {
  const { name } = prop;
  return (
    <div>
      <div style={{ margin: "3px" }}>Preview</div>
      <PreviewText name={name} style={{ height: "300px", margin: "10px" }} />
      <div style={{ marginLeft: "12px", marginBottom: "8px" }}>
        <Button type="button" style={{ border: "0.5px solid" }}>
          편집
        </Button>
      </div>
      <div style={{ marginLeft: "12px", marginBottom: "8px" }}>
        <Button type="button" style={{ border: "0.5px solid" }}>
          재생
        </Button>
      </div>
      <div style={{ marginLeft: "12px", marginBottom: "8px" }}>
        <Button type="button" style={{ border: "0.5px solid" }}>
          잠금
        </Button>
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
