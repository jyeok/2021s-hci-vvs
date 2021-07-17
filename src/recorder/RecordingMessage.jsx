/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MessageList,
  Message,
  ChatContainer,
} from "@chatscope/chat-ui-kit-react";
import { CircularProgress } from "@material-ui/core";
import { secondsToTime } from "recorder/Util";

const RecordingMessage = (props) => {
  const { contents, listening, interimString } = props;

  const messages = contents.map((m, i) => {
    const model = {
      message: m.content,
      sentTime: m.start,
      direction: m.isMine ? "outgoing" : "incoming",
      position: "single",
    };

    return (
      <Message model={model} key={m.start}>
        <Message.Footer sentTime={secondsToTime(m.start)} />
      </Message>
    );
  });

  return (
    <div>
      <ChatContainer style={({ position: "relative" }, { height: "550px" })}>
        <MessageList>
          {messages}
          {listening && (
            <Message
              model={{
                type: "custom",
                direction: "outgoing",
              }}
            >
              <Message.CustomContent>
                <CircularProgress size={20} style={{ marginRight: "5px" }} />
                듣는 중... <br />
                <br />
                {interimString}
              </Message.CustomContent>
            </Message>
          )}
        </MessageList>
      </ChatContainer>
    </div>
  );
};

export default RecordingMessage;

RecordingMessage.propTypes = {
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      isMine: PropTypes.number,
      isHighlighted: PropTypes.bool.isRequired,
      isModified: PropTypes.bool,
      reliability: PropTypes.number,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    })
  ),
  listening: PropTypes.bool.isRequired,
  interimString: PropTypes.string.isRequired,
};

RecordingMessage.defaultProps = {
  contents: [
    {
      content: "Test",
      isMine: 1,
      isHighlighted: 0,
      isModified: 0,
      reliability: 0.82,
      start: "1.2",
      end: "1.6",
    },
  ],
};