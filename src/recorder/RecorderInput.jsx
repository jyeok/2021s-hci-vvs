import React from "react";
import propTypes from "prop-types";

import { Grid, TextField } from "@material-ui/core";

const RecorderInput = (props) => {
  const {
    inputHandler: [inputState, setInputState],
  } = props;
  const { title, memo, tag } = inputState;

  const onInputChange = (e) => {
    const { name } = e.target;
    const newInputState = {
      ...inputState,
    };

    newInputState[name] = e.target.value;
    setInputState(newInputState);
  };

  return (
    <>
      <Grid
        item
        xs={3}
        style={{
          height: "600px",
          border: "1px solid",
          borderTop: "0px",
          borderLeft: "0px",
          overflow: "scroll",
        }}
      >
        <TextField
          required
          label="녹음 제목"
          error={title === ""}
          onChange={onInputChange}
          value={title}
          name="title"
          placeholder="녹음 제목"
          fullWidth
        />
        <TextField
          label="메모"
          name="memo"
          value={memo}
          multiline
          rows={19}
          placeholder="여기에 메모를 입력하세요."
          fullWidth
          onChange={onInputChange}
        />
        <TextField
          label="태그"
          multiline
          rows={7}
          placeholder="녹음이 종료되면 키워드가 생성됩니다. 직접 추가할 수도 있습니다. ex) #약속 #밥"
          name="tag"
          value={tag}
          fullWidth
          onChange={onInputChange}
        />
      </Grid>
    </>
  );
};

export default RecorderInput;

RecorderInput.propTypes = {
  inputHandler: propTypes.arrayOf(propTypes.object).isRequired,
};
