/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import {
  Grid,
  TextField,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { ArrowBack, Message } from "@material-ui/icons";
import HelpIcon from "@material-ui/icons/Help";

import { useQuery, useMutation } from "@apollo/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { answerQuestion } from "api/ai/answerQuestion";
import TextRank from "api/ai/summarization";
import { base64StringToBlob } from "blob-util";

// import { separateOperations } from "graphql";
import { yellow } from "@material-ui/core/colors";
import MessageHolder from "../MessageHolder/MessageHolder";
import { queries, mutations } from "../../api/gql/schema";

const PlayingRecord = () => {
  const audioRef = useRef();
  const recordId = parseInt(useParams().id, 10);
  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id: recordId },
  });

  const [updateTextMutation, { loading2, error2 }] = useMutation(
    mutations.updateTextBlock
  );

  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [editTextOpen, editTextsetOpen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [textB, setTextB] = useState("");

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
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const slowPlaybackSpeed = () => {
    setSpeed(speed - 0.1);
    audioRef.current.audio.current.playbackRate = speed;
  };
  const fastPlaybackSpeed = () => {
    setSpeed(speed + 0.1);
    audioRef.current.audio.current.playbackRate = speed;
  };
  const handleTextOpen = () => {
    editTextsetOpen(true);
  };
  const handleTextClose = () => {
    editTextsetOpen(false);
  };

  function updateText(newContent, textId) {
    updateTextMutation({
      variables: {
        id: textId,
        data: {
          content: newContent,
        },
      },
    });
  }

  function handleBookMark(textId, highlight) {
    updateTextMutation({
      variables: {
        id: textId,
        data: {
          isHighlighted: 1 - highlight,
        },
      },
    });
  }
  const dataType = "data:audio/webm;";
  const codecs = "codecs=opus";
  const encoding = "base64";
  const url = `${dataType};${codecs};${encoding},{data.recordById.voice}`;

  const blob = base64StringToBlob(data.recordById.voice, dataType + codecs);
  const temp = URL.createObjectURL(blob);

  const playText = (d) => {
    const aud = audioRef.current.audio.current;
    const dd = d.split(":").map((e) => parseInt(e, 10));
    const curTime = dd[0] * 60 + dd[1];
    aud.currentTime = curTime;
  };

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
          onMouseLeave={handleClose}
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
      </Grid>
      <Grid
        item
        xs={12}
        style={{ borderBottom: "0.5px solid", height: "500px" }}
      >
        {data.recordById?.content.map((e, i) => (
          <Tooltip
            interactive
            key={`${recordId + i * 10}`}
            title={
              <>
                <Button onClick={() => playText(e.start)}>텍스트 재생</Button>
                <Button onClick={() => handleBookMark(e.id, e.isHighlighted)}>
                  {e.isHighlighted ? "북마크 제거" : "북마크 추가"}
                </Button>
                <Button onClick={handleTextOpen}>텍스트 편집</Button>
                <Dialog
                  open={editTextOpen}
                  onClose={handleTextClose}
                  fullWidth
                  maxWidth="lg"
                >
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="수정할 텍스트 입력"
                      defaultValue={e.content}
                      fullWidth
                      maxWidth="lg"
                      onChange={(er) => {
                        setTextB(er.target.value);
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleTextClose}>취소</Button>
                    <Button onClick={() => updateText(textB, e.id)}>
                      확인
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            }
          >
            <div>
              <MessageHolder
                key={`${recordId + i * 20000}`}
                id={e.id}
                content={e.content}
                isMine={e.isMine}
                start={e.start}
                isHighlighted={e.isHighlighted}
              />
            </div>
          </Tooltip>
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
            aud.playbackRate = speed;
          }}
        />
        <Button onClick={slowPlaybackSpeed}>-</Button>
        <Button>{speed.toFixed(1)}x</Button>
        <Button onClick={fastPlaybackSpeed}>+</Button>
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
