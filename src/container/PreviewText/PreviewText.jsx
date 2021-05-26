import React from "react";
import PropTypes from "prop-types";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "@material-ui/system";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
} from "@chatscope/chat-ui-kit-react";

const PreviewText = (prop) => {
  const { name, arrivalTime } = prop;
  return (
    <div
      style={{
        position: "relative",
        height: "300px",
        margin: "10px",
        border: "1px solid",
      }}
    >
      <MainContainer>
        <ChatContainer>
          <MessageList>
            <Message
              model={{
                message: "Hello my friend",
                sentTime: { arrivalTime },
                sender: { name },
                direction: "incoming",
                position: "single",
              }}
            />
            <Message
              model={{
                message: "ㄴㅏ는 배가 고프다",
                sentTime: "just now",
                sender: "me",
                direction: "outgoing",
                position: "single",
              }}
            />
          </MessageList>
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default PreviewText;

PreviewText.PropType = {
  name: PropTypes.string.isRequired,
  arrivalTime: PropTypes.string,
};
