/* eslint-disable no-console */

import React from "react";
import propTypes from "prop-types";
import { useHistory } from "react-router";

import { useElapsedTime } from "use-elapsed-time";

import { Grid, Button, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { secondsToTime, statusToBackground } from "./Util";
import { RECORD_STATUS } from "./constants";

import Recorder from "./Recorder";

const RecordTopPanel = (props) => {
  const history = useHistory();
  const { recordStatus, speechHandler } = props;
  const [status] = recordStatus;

  const { elapsedTime } = useElapsedTime(status === RECORD_STATUS.RECORDING);

  const backgroundStyle = statusToBackground(status);

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="baseline"
      style={backgroundStyle}
    >
      <Grid item xs={2}>
        <Button
          onClick={() => history.goBack()}
          startIcon={<ArrowBack />}
          disabled={status === RECORD_STATUS.RECORDING}
        >
          <Typography variant="button">뒤로가기</Typography>
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="subtitle2">
          녹음 시간: {secondsToTime(elapsedTime.toFixed(0))}
        </Typography>
      </Grid>
      <Recorder speechHandler={speechHandler} recordStatus={recordStatus} />
    </Grid>
  );
};

export default RecordTopPanel;

RecordTopPanel.propTypes = {
  recordStatus: propTypes.arrayOf(propTypes.any).isRequired,
  speechHandler: propTypes.shape({
    onTranscript: propTypes.func,
    onSpeechError: propTypes.func,
    onInterim: propTypes.func,
    onSaveVoice: propTypes.func,
    onSaveRecord: propTypes.func,
  }),
};

RecordTopPanel.defaultProps = {
  speechHandler: {
    onTranscript: (e) => console.log(e),
    onSpeechError: (err) => console.log(err),
    onInterim: (e) => console.log(e),
    onSave: (e) => console.log(e),
  },
};
