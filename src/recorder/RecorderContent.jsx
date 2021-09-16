/* eslint-disable */

import React from "react";
import propTypes from "prop-types";

import { Grid, Typography } from "@material-ui/core";

import { Message } from "@chatscope/chat-ui-kit-react";
import ChatContainer from "@chatscope/chat-ui-kit-react/dist/cjs/ChatContainer";
import MessageList from "@chatscope/chat-ui-kit-react/dist/cjs/MessageList";

import { secondsToTime } from "./Util";
import { RECORD_STATUS } from "./constants";

const textBlockToMessage = (textBlocks) =>
  textBlocks.map((blk) => {
    const model = {
      message: blk.content,
      sentTime: blk.start,
      direction: blk.isMine ? "outgoing" : "incoming",
      position: "single"
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
  console.log(textData, recording, interimString);

  return (
    <Grid
      item
      xs={9}
      style={{
        height: "600px",
        border: "1px solid",
        borderTop: "0px",
        overflow: "scroll"
      }}
    >
      <ChatContainer style={({ position: "relative" }, { height: "550px" })}>
        <MessageList>
          {messages}
          {recording === RECORD_STATUS.RECORDING && (
            <Message
              model={{
                direction: "outgoing",
                message: "듣는 중..."
              }}
            />
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
      id: propTypes.number.isRequired,
      content: propTypes.string.isRequired,
      isMine: propTypes.number,
      isHighlighted: propTypes.bool.isRequired,
      isModified: propTypes.bool,
      reliability: propTypes.number,
      start: propTypes.string.isRequired,
      end: propTypes.string.isRequired
    })
  ),
  recording: propTypes.number.isRequired,
  interimString: propTypes.string.isRequired
};

RecorderContent.defaultProps = {
  textData: [
    {
      content: "Test",
      isMine: 1,
      isHighlighted: 0,
      isModified: 0,
      reliability: 0.82,
      start: "1.2",
      end: "1.6"
    }
  ]
};
