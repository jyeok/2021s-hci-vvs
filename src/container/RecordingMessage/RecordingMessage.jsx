import React from "react";
import PropTypes from "prop-types";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MessageList, Message } from "@chatscope/chat-ui-kit-react";

const RecordingMessage = (prop) => {
  const { isMine, content, start } = prop;
  return (
    <div style={({ position: "relative" }, { height: "550px" })}>
      <MessageList>
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
    </div>
  );
};

export default RecordingMessage;

RecordingMessage.PropType = {
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

RecordingMessage.defaultProps = {
  content: "Mock",
  isMine: 0,
  start: "00:34",
};
