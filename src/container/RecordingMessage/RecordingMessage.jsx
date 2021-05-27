import React from "react";
import PropTypes from "prop-types";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
} from "@chatscope/chat-ui-kit-react";

const RecordingMessage = (props) => {
  const { name, messageTalk } = props;
  return (
    <div style={({ position: "relative" }, { height: "550px" })}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            <Message
              model={{
                message: messageTalk,
                sentTime: "just now",
                sender: name,
              }}
            />
          </MessageList>
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default RecordingMessage;

RecordingMessage.propTypes = {
  name: PropTypes.string.isRequired,
  messageTalk: PropTypes.string.isRequired,
};
