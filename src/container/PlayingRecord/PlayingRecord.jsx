/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Grid, TextField, Button, Menu, MenuItem } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";

import { useQuery } from "@apollo/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { answerQuestion } from "api/ai/answerQuestion";
import TextRank from "api/ai/summarization";
import { base64StringToBlob } from "blob-util";

import MessageHolder from "../MessageHolder/MessageHolder";
import { queries } from "../../api/gql/schema";

const PlayingRecord = () => {
  const audioRef = useRef();
  const recordId = parseInt(useParams().id, 10);
  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id: recordId },
  });
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };
  const [anchorEl, setAnchorEl] = useState(null);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (!data.recordById) goBack();

  const newData = data.recordById.content.map((e) => e.content);

  const finalQuestionData = newData.reduce((acc, cur) => `${acc} ${cur}`, "");

  const textrank = new TextRank(newData);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleValue = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const questionInput = e.target.question.value;
    answerQuestion(finalQuestionData, questionInput).then((result) => {
      // eslint-disable-next-line no-alert
      alert(result);
    });
  };
  const SelectItem = (eventKey) => {
    const numOfSentence = eventKey.target.value;
    // eslint-disable-next-line no-alert
    alert(textrank.getSummarizedText(numOfSentence));
    setAnchorEl(null);
  };

  // console.log(temp);
  const dataType = "data:audio/webm;";
  const codecs = "codecs=opus";
  const encoding = "base64";
  const url = `${dataType};${codecs};${encoding},{data.recordById.voice}`;

  const blob = base64StringToBlob(data.recordById.voice, dataType + codecs);
  const temp = URL.createObjectURL(blob);

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid
        item
        xs={12}
        style={({ borderBottom: "0.5px solid" }, { height: "50px" })}
      >
        <ArrowBack onClick={goBack} />
        <Button
          aria-controls="compressAll"
          aria-haspopup="true"
          onMouseEnter={handleClick}
          style={{ float: "right" }}
        >
          전체요약
        </Button>
        <Menu
          id="compressAll"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={SelectItem} value={1}>
            1
          </MenuItem>
          <MenuItem onClick={SelectItem} value={2}>
            2
          </MenuItem>
          <MenuItem onClick={SelectItem} value={3}>
            3
          </MenuItem>
          <MenuItem onClick={SelectItem} value={4}>
            4
          </MenuItem>
          <MenuItem onClick={SelectItem} value={5}>
            5
          </MenuItem>
        </Menu>

        <Button style={{ float: "right" }}>선택요약</Button>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ borderBottom: "0.5px solid", height: "500px" }}
      >
        {data.recordById &&
          data.recordById.content.map((e, i) => (
            <MessageHolder
              key={`${recordId + i * 2}`}
              id={e.id}
              content={e.content}
              isMine={e.isMine}
              start={e.start}
              isHighlighted={e.isHighlighted}
            />
          ))}
      </Grid>
      <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
        <AudioPlayer
          autoplay
          src={temp}
          ref={audioRef}
          onLoadedMetaData={() => {
            const aud = audioRef.current.audio.current;
            if (aud.duration === Infinity) {
              aud.currentTime = 1e101;
            }
          }}
          onLoadedData={() => {
            const aud = audioRef.current.audio.current;
            aud.currentTime = 0;
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <HelpIcon fontSize="large" />
      </Grid>
      <Grid item xs={11}>
        <form onSubmit={handleValue}>
          <TextField
            id="question"
            row="1"
            label="여기에 질문을 입력해보세요."
            fullWidth
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default PlayingRecord;
