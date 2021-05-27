import React from "react";
import { Grid } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { PropTypes } from "prop-types";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
} from "@chatscope/chat-ui-kit-react";

import { Media, Player, controls } from "react-media-player";

const PlayingRecord = (prop) => {
  const { name, createdAt, messageDisplayed, record } = prop;
  const { PlayPause, MuteUnmute } = controls;
  return (
    <div>
      <Grid container padding={15} style={{ border: "1px solid" }}>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <ArrowBack />
          {name} {createdAt}
          <button type="button">전체 요약</button>
          <button type="button">선택 요약</button>
        </Grid>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <div>
            <MainContainer style={{ height: "550px" }}>
              <ChatContainer>
                <MessageList>
                  <Message
                    model={{
                      message: messageDisplayed,
                      sentTime: "2020/05/04",
                      sender: "Susan",
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
        </Grid>
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <div>
            <Media>
              <div className="media">
                <div className="media-player">
                  <Player src={record} />
                </div>
                <div className="media-controls">
                  <PlayPause />
                  <MuteUnmute />
                </div>
              </div>
            </Media>
          </div>
        </Grid>
        <Grid>
          <div>
            질문하기
            <textarea row="1" style={{ width: "180%" }}>
              여기에 질문을 입력하시면 대답해 드립니다.
            </textarea>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlayingRecord;

PlayingRecord.defaultProps = {
  name: "녹음명",
  createdAt: "녹음 날짜",
  messageDisplayed: "can you play this sample message?",
  record: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
};

PlayingRecord.PropType = {
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  messageDisplayed: PropTypes.string.isRequired,
  record: PropTypes.string.isRequired,
};
