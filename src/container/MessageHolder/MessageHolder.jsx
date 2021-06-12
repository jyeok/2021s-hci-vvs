import React from "react";
import { PropTypes } from "prop-types";
import { Message } from "@chatscope/chat-ui-kit-react";

const MessageHolder = (prop) => {
  const { content, isMine, start, isHighlighted } = prop;

  return (
    <Message
      style={{ margin: "10px" }}
      model={{
        message: content,
        sentTime: start,
        direction: isMine ? "incoming" : "outgoing",
        position: "single",
      }}
    >
      {isHighlighted && <Message.Header>북마크</Message.Header>}
    </Message>
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
