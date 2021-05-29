import React from "react";
import { PropTypes } from "prop-types";
import { Message } from "@chatscope/chat-ui-kit-react";

// Render a YouTube video player

const MessageHolder = (prop) => {
  const { content, isMine, start } = prop;
  return (
    <Message
      style={{ margin: "10px" }}
      model={{
        message: content,
        sentTime: start,
        direction: isMine ? "incoming" : "outgoing",
        position: "single",
      }}
    />
  );
};

export default MessageHolder;

MessageHolder.defaultProps = {
  content: "Does this work?",
  isMine: 1,
  start: "03:45",
};

MessageHolder.PropType = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  isMine: PropTypes.number,
  isHighlighted: PropTypes.bool.isRequired,
  reliability: PropTypes.number,
  start: PropTypes.string.isRequired,
};
