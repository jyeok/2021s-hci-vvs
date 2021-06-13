import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { Button, Grid, TextField } from "@material-ui/core";

import { TextBlock } from "proptypes/ModelPropTypes";
import MessageHolder from "../MessageHolder/MessageHolder";

const pborder = {
  border: "0.5px solid",
};

const onLock = (e) => {
  // eslint-disable-next-line
  console.log("onLock :>> ", e);
};
function Preview(props) {
  const { id, memo, tag, content } = props;

  const messages = content.map((e, i) => (
    <MessageHolder
      key={`${id}${i * 2}`}
      id={id}
      content={e.content}
      isMine={e.isMine}
      isHighlighted={e.isHighlighted}
      isModified={e.isModified}
      reliability={e.reliability}
    />
  ));

  return (
    <div style={{ margin: "5px" }}>
      Preview
      <div
        style={{
          border: "1px solid",
          margin: "5px",
          height: "300px",
          overflow: "scroll",
        }}
      >
        {messages}
      </div>
      <TextField
        label="태그"
        value={tag}
        fullWidth
        margin="normal"
        variant="outlined"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="메모"
        value={memo}
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={5}
        InputProps={{ readOnly: true }}
      />
      <Grid container style={{ marginTop: "15px" }}>
        <Grid item xs={4}>
          <Button
            style={pborder}
            size="large"
            color="primary"
            variant="contained"
            component={Link}
            to="recording"
          >
            녹음 추가
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            style={pborder}
            size="large"
            color="primary"
            variant="contained"
            component={Link}
            to={`playing/${id}`}
            disabled={!(id && id !== 0)}
          >
            녹음 재생
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            style={pborder}
            size="large"
            color="primary"
            variant="contained"
            onClick={onLock}
            disabled={!(id && id !== 0)}
          >
            파일 잠금
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
export default Preview;

const { id, end, ...messageTemplate } = TextBlock;
Preview.propTypes = {
  id: PropTypes.number,
  memo: PropTypes.string,
  tag: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape(messageTemplate)).isRequired,
};

Preview.defaultProps = {
  id: 0,
  memo: "저장된 메모가 없습니다.",
  tag: "저장된 태그가 없습니다.",
};
