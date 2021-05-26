import React from "react";
import Box from "@material-ui/core/Box";

function RecordingKeyword(prop) {
  const { keyword } = prop;
  return (
    <div style={{ borderTop: "1px dotted" }}>
      {keyword}
      <Box style={{ height: "200px", border: "0.5px solid", margin: "10px" }}>
        여기가 키워드 내용
      </Box>
    </div>
  );
}

export default RecordingKeyword;
