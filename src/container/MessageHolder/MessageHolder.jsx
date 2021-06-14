import React from "react";
import { PropTypes } from "prop-types";
import { Message } from "@chatscope/chat-ui-kit-react";

const MessageHolder = (props) => {
  const { content, isMine, start, isHighlighted, bindHover } = props;

  return (
    <Message
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...bindHover()}
      style={{ margin: "10px" }}
      model={{
        message: content,
        sentTime: start,
        direction: isMine ? "outgoing" : "incoming",
        position: "single",
      }}
    >
      {isHighlighted ? <Message.Header>북마크</Message.Header> : false}
      <Message.Footer sentTime={start} />
    </Message>
  );
};

export default MessageHolder;

MessageHolder.defaultProps = {
  isMine: 1,
  reliability: 0.5,
  bindHover: () => {},
};

MessageHolder.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  isMine: PropTypes.number,
  isHighlighted: PropTypes.bool.isRequired,
  reliability: PropTypes.number,
  start: PropTypes.string.isRequired,
  bindHover: PropTypes.func,
};
