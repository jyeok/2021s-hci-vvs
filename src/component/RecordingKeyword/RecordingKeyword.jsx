import React from "react";

function RecordingKeyword(prop) {
  const { keyword } = prop;
  return (
    <div style={{ borderTop: "1px dotted" }}>
      <div>{keyword}</div>
      <textarea
        style={{
          width: "90%",
          height: "200px",
          border: "0.5px solid",
          margin: "10px",
        }}
      >
        여기가 키워드 내용
      </textarea>
    </div>
  );
}

export default RecordingKeyword;
