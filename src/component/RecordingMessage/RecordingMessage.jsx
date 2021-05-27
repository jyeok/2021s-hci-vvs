import React, { PureComponent } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
} from "@chatscope/chat-ui-kit-react";

class RecordingMessage extends PureComponent {
  render() {
    return (
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              <Message
                model={{
                  message: "Hello my friend",
                  sentTime: "just now",
                  sender: "Joe",
                }}
              />
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
    );
  }
}

export default RecordingMessage;
