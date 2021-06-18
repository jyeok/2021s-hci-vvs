/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { mutations } from "api/gql/schema";

import { Box, Button, Grid, TextField } from "@material-ui/core";
import { Lock, PlayArrow, RecordVoiceOver } from "@material-ui/icons";

import { TextBlock } from "proptypes/ModelPropTypes";
import MessageHolder from "../MessageHolder/MessageHolder";

const pborder = {
  border: "0.5px solid",
};

const Preview = (props) => {
  const { id, memo, tag, content, isLocked } = props;

  const history = useHistory();
  const [lockMutation] = useMutation(mutations.lockRecord);
  const [unLockMutation] = useMutation(mutations.unLockRecord);

  const handleLock = () => {
    lockMutation({
      variables: {
        id,
      },
    });
  };

  const handleUnlock = () => {
    unLockMutation({
      variables: {
        id,
      },
    });
  };

  const onLock = async () => {
    if (isLocked === 0) await handleLock();
    else await handleUnlock();
  };

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
      <Box
        style={{
          border: "1px solid",
          margin: "5px",
          height: "300px",
          overflow: "scroll",
        }}
        onClick={() => {
          if (!isLocked) history.push(`playing/${id}`);
        }}
      >
        {isLocked ? (
          <MessageHolder
            content="파일이 잠겼습니다! 우선 잠금을 해제해 주세요."
            start=""
          />
        ) : (
          messages
        )}
      </Box>
      <TextField
        label="태그"
        value={isLocked ? "잠금을 해제해 주세요." : tag}
        fullWidth
        margin="normal"
        variant="filled"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="메모"
        value={isLocked ? "잠금을 해제해 주세요." : memo}
        fullWidth
        margin="normal"
        variant="filled"
        multiline
        rows={5}
        InputProps={{ readOnly: true }}
      />
      <Grid container style={{ marginTop: "5px" }}>
        <Grid item lg={4} md={4}>
          <Button
            style={pborder}
            size="large"
            color="primary"
            variant="contained"
            component={Link}
            to="recording"
            startIcon={<RecordVoiceOver />}
          >
            녹음 추가
          </Button>
        </Grid>
        <Grid item lg={4} md={4}>
          <Button
            style={pborder}
            size="large"
            color="primary"
            variant="contained"
            component={Link}
            to={`playing/${id}`}
            startIcon={<PlayArrow />}
            disabled={!(id && id !== 0) || isLocked === 1}
          >
            녹음 재생
          </Button>
        </Grid>
        <Grid item lg={4} md={4}>
          <Button
            style={pborder}
            size="large"
            color="primary"
            variant="contained"
            onClick={onLock}
            disabled={!(id && id !== 0)}
            startIcon={<Lock />}
          >
            {isLocked === 0 ? "녹음 잠금" : "잠금 해제"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default Preview;

const { id, end, ...messageTemplate } = TextBlock;
Preview.propTypes = {
  id: PropTypes.number,
  memo: PropTypes.string,
  tag: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape(messageTemplate)).isRequired,
  isLocked: PropTypes.number,
};

Preview.defaultProps = {
  id: 0,
  memo: "저장된 메모가 없습니다.",
  tag: "저장된 태그가 없습니다.",
  isLocked: 0,
};
