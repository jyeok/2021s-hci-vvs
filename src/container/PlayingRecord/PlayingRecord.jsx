import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";
import AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import MessageHolder from "../MessageHolder/MessageHolder";

// Render a YouTube video player

const PlayingRecord = (prop) => {
  const { voice } = prop;
  return (
    <div>
      <Grid container padding={15} style={{ border: "1px solid" }}>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <ArrowBack />
          <button type="button">전체 요약</button>
          <button type="button">선택 요약</button>
        </Grid>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <MessageHolder />
        </Grid>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <AudioPlayer src={voice} />
        </Grid>
        <Grid item xs={1}>
          <HelpIcon fontSize="large" />
        </Grid>
        <Grid item xs={11}>
          <TextField
            id="Question"
            row="1"
            label="여기에 질문을 입력해보세요."
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PlayingRecord;

PlayingRecord.defaultProps = {
  voice:
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
};
