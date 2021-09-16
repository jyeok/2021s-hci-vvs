/* eslint-disable */
import React from "react";
import propTypes from "prop-types";

import { Grid, Typography } from "@material-ui/core";

import {
  Message,
  ChatContainer,
  MessageList,
} from "@chatscope/chat-ui-kit-react";

import { secondsToTime } from "./Util";
import { RECORD_STATUS } from "./constants";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const textBlockToMessage = (textBlocks) =>
  textBlocks.map((blk) => {
    const model = {
      message: blk.content,
      sentTime: blk.start.toString(),
      direction: blk.isMine ? "outgoing" : "incoming",
      position: "single",
    };

    return (
      <Message model={model} key={blk.start}>
        <Message.Footer sentTime={secondsToTime(blk.start)} />
      </Message>
    );
  });

const RecorderContent = (props) => {
  const { textData, recording, interimString } = props;
  const messages = textBlockToMessage(textData);

  return (
    <Grid
      item
      xs={9}
      style={{
        height: "600px",
        border: "1px solid",
        borderTop: "0px",
        overflow: "scroll",
      }}
    >
      <ChatContainer style={({ position: "relative" }, { height: "550px" })}>
        <MessageList>
          {messages}
          {recording === RECORD_STATUS.RECORDING && (
            <Message
              model={{
                type: "custom",
                direction: "outgoing",
              }}
            >
              <Message.CustomContent>
                <Typography variant="body2"> 듣는 중... </Typography>
                <Typography variant="body1"> {interimString} </Typography>
              </Message.CustomContent>
            </Message>
          )}
        </MessageList>
      </ChatContainer>
    </Grid>
  );
};

export default RecorderContent;

RecorderContent.propTypes = {
  textData: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number,
      content: propTypes.string,
      isMine: propTypes.number,
      isHighlighted: propTypes.number,
      isModified: propTypes.number,
      reliability: propTypes.number,
      start: propTypes.number,
      end: propTypes.number,
    })
  ),
  recording: propTypes.number.isRequired,
  interimString: propTypes.string.isRequired,
};

RecorderContent.defaultProps = {
  textData: [
    {
      content: "Test",
      isMine: 1,
      isHighlighted: 0,
      isModified: 0,
      reliability: 0.82,
      start: 1.2,
      end: 1.6,
    },
  ],
};
