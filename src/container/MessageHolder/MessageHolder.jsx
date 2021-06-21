/* eslint-disable no-nested-ternary */
import React from "react";
import { PropTypes } from "prop-types";
import { Message } from "@chatscope/chat-ui-kit-react";

const MessageHolder = (props) => {
  const {
    content,
    isMine,
    start,
    isHighlighted,
    reliability,
    bindHover,
    isModified,
  } = props;

  const cred = (100 * reliability).toFixed(2);

  const reliabilityClass = isModified
    ? "very-high-reliability"
    : reliability <= 0.2
    ? "very-low-reliability"
    : reliability <= 0.4
    ? "low-reliability"
    : reliability <= 0.6
    ? "mid-reliability"
    : reliability <= 0.8
    ? "high-reliability"
    : "very-high-reliability";

  return (
    <Message
      className={reliabilityClass}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...bindHover()}
      style={{ margin: "10px" }}
      model={{
        message: content,
        sender: "123",
        sentTime: start,
        direction: isMine ? "outgoing" : "incoming",
        position: "single",
      }}
    >
      {isHighlighted ? <Message.Header>북마크</Message.Header> : false}
      <Message.Footer>
        {start}, {cred}%
      </Message.Footer>
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
  isModified: PropTypes.bool.isRequired,
  reliability: PropTypes.number,
  start: PropTypes.string.isRequired,
  bindHover: PropTypes.func,
};
