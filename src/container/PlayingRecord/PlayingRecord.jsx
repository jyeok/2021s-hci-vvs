import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";
import { PropTypes } from "prop-types";
import AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MessageList, Message } from "@chatscope/chat-ui-kit-react";

// Render a YouTube video player

const PlayingRecord = (prop) => {
  const { content, isMine, start, voice } = prop;
  return (
    <div>
      <Grid container padding={15} style={{ border: "1px solid" }}>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <ArrowBack />
          <button type="button">전체 요약</button>
          <button type="button">선택 요약</button>
        </Grid>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <MessageList style={{ height: "550px" }}>
            <Message
              model={{
                message: content,
                sentTime: start,
                sender: "Susan",
                direction: isMine ? "incoming" : "outgoing",
                position: "single",
              }}
            />
          </MessageList>
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
  content: "Does this work?",
  isMine: 1,
  start: "03:45",
  voice:
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
};

PlayingRecord.PropType = {
  PlayingRecord: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    isMine: PropTypes.number,
    isHighlighted: PropTypes.bool.isRequired,
    isModified: PropTypes.bool,
    reliability: PropTypes.number,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    voice: PropTypes.string.isRequired,
  }),
};
