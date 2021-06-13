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
import { MessageInput } from "@chatscope/chat-ui-kit-react";
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
  const [updateRecordMutation, { loading3, error3 }] = useMutation(
    mutations.updateRecord
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
  const [summary, setSummary] = useState(true);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (!data.recordById) goBack();

  const newData = data.recordById.content.map((e) => e.content);
  const finalQuestionData = newData.reduce((acc, cur) => `${acc} ${cur}`, "");
  const { memo } = data.recordById;
  const { tag } = data.recordById;

  const textrank = new TextRank(newData);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleValue = (e) => {
    const questionInput = e;
    answerQuestion(finalQuestionData, questionInput).then((result) => {
      const answerFinal = result[0];
      const realAnswer = newData.filter((x) => x.indexOf(answerFinal) !== -1);
      alert(realAnswer);
    });
  };

  const sumClose = () => {
    setSummary(false);
  };
  const SelectItem = (eventKey) => {
    const numOfSentence = eventKey.target.value;
    console.log(textrank.getSummarizedText(numOfSentence));
    setAnchorEl(null);

    return textrank.getSummarizedText(numOfSentence);
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
    handleTextClose();
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

  function textLocation(textId, mine) {
    updateTextMutation({
      variables: {
        id: textId,
        data: {
          isMine: 1 - mine,
        },
      },
    });
  }

  function updateMemoMutation(recordIdNum, memoContent) {
    updateRecordMutation({
      variables: {
        id: recordIdNum,
        data: {
          memo: memoContent,
        },
      },
    });
  }
  function updateTagMutation(recordIdNum, tagContent) {
    updateRecordMutation({
      variables: {
        id: recordIdNum,
        data: {
          tag: tagContent,
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
    aud.currentTime = Number.parseFloat(d);
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
        xs={9}
        style={({ borderBottom: "0.5px solid" }, { height: "500px" })}
      >
        {data.recordById?.content.map((e, i) => (
          <Tooltip
            interactive
            key={`${recordId + i * 10}`}
            fullWidth
            maxWidth="ml"
            title={
              <div>
                <Button onClick={() => playText(e.start)}>텍스트 재생</Button>
                <Button onClick={handleTextOpen}>텍스트 편집</Button>
                <Button onClick={() => textLocation(e.id, e.isMine)}>
                  텍스트 위치 변환
                </Button>
                <Button onClick={() => handleBookMark(e.id, e.isHighlighted)}>
                  {e.isHighlighted ? "북마크 제거" : "북마크 추가"}
                </Button>
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
              </div>
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
      <Grid
        item
        xs={3}
        style={({ borderLeft: "0.5px solid" }, { height: "500px" })}
      >
        <TextField
          label="메모"
          defaultValue={memo}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={8}
          onChange={(er) => {
            updateMemoMutation(data.recordById.id, er.target.value);
          }}
        />
        <TextField
          label="태그"
          defaultValue={tag}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          onChange={(er) => {
            updateTagMutation(data.recordById.id, er.target.value);
          }}
        />
      </Grid>
      <Grid item xs={11}>
        <AudioPlayer
          autoplay
          src={temp}
          ref={audioRef}
          autoPlayAfterSrcChange={false}
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
      </Grid>
      <Grid item xs={1}>
        <Button onClick={fastPlaybackSpeed} size="small">
          +
        </Button>
        <Button size="small">{speed.toFixed(1)}x</Button>
        <Button onClick={slowPlaybackSpeed} size="small">
          -
        </Button>
      </Grid>
      <Grid item xs={12}>
        <MessageInput
          attachButton={false}
          placeholder="여기에 질문을 입력해보세요"
          onSend={handleValue}
        />
      </Grid>
    </Grid>
  );
};

export default PlayingRecord;
