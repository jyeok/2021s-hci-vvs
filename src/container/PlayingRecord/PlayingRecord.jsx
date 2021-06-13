import React, { useState, useRef, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { useQuery, useMutation } from "@apollo/client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { answerQuestion } from "api/ai/answerQuestion";
import TextRank from "api/ai/summarization";
import { base64StringToBlob } from "blob-util";

import { useSnackbar } from "notistack";
import Loading from "container/Loading/Loading";
import { MessageInput } from "@chatscope/chat-ui-kit-react";
import PopupDialog from "container/PopupDialog/PopupDialog";
import MessageHolder from "../MessageHolder/MessageHolder";
import { queries, mutations } from "../../api/gql/schema";

const PlayingRecord = () => {
  const audioRef = useRef();

  const recordId = parseInt(useParams().id, 10);
  const { loading, error, data } = useQuery(queries.recordById, {
    variables: { id: recordId },
  });

  const [updateTextMutation] = useMutation(mutations.updateTextBlock);
  const [updateRecordMutation] = useMutation(mutations.updateRecord);

  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };
  const [editTextOpen, editTextsetOpen] = useState(false);
  const [textB, setTextB] = useState("");
  // eslint-disable-next-line prefer-const
  let [questionBlock, setQuestionBlock] = useState("");
  // eslint-disable-next-line no-unused-vars
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setQuestionBlock(questionBlock);
  }, [questionBlock]);

  if (loading)
    return <Loading message="녹음 파일을 로딩중입니다." transparent />;
  if (error) return <Loading message="오류가 발생했습니다." error />;

  if (!data.recordById) goBack();

  const newData = data.recordById.content.map((e) => e.content);
  const finalQuestionData = newData.reduce((acc, cur) => `${acc} ${cur}`, "");
  const { memo } = data.recordById;
  const { tag } = data.recordById;

  const textrank = new TextRank(newData);

  const handleDialogClose = () => {
    questionBlock = null;
  };

  const handleValue = async (e) => {
    const questionInput = e;

    answerQuestion(finalQuestionData, questionInput).then((result) => {
      const answerFinal = result[0];
      const realAnswer = newData.filter((x) => x.indexOf(answerFinal) !== -1);

      questionBlock = realAnswer;
    });
  };

  const selectItem = (eventKey) => {
    const numOfSentence = eventKey.target.value;
    return enqueueSnackbar(textrank.getSummarizedText(numOfSentence), {
      variant: "success",
    });
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

  const blob = base64StringToBlob(data.recordById.voice, dataType + codecs);
  const temp = URL.createObjectURL(blob);

  const playText = (d) => {
    const aud = audioRef.current.audio.current;
    aud.currentTime = Number.parseFloat(d);
    // const timeStamp = d.split(":").map((e) => parseInt(e, 10));
    // const curTime = timeStamp[0] * 60 + timeStamp[1];
    // aud.currentTime = curTime;
  };

  const handleChange = (event) => {
    audioRef.current.audio.current.playbackRate = event.target.value;
  };

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid
        item
        xs={12}
        style={({ borderBottom: "0.5px solid" }, { height: "50px" })}
      >
        <ArrowBack onClick={goBack} />
        <FormControl style={{ float: "right", width: "70px" }}>
          <InputLabel id="numCompress">전체 요약</InputLabel>
          <Select
            labelId="numCompress"
            onChange={(e) => selectItem(e)}
            defaultValue={1}
          >
            <MenuItem defaultChecked value={1}>
              1
            </MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={9}
        style={({ borderBottom: "0.5px solid" }, { height: "500px" })}
      >
        <div style={{ height: "500px", overflow: "scroll" }}>
          {data.recordById?.content.map((e, i) => (
            <Tooltip
              interactive
              key={`${recordId + i * 10}`}
              title={
                <div>
                  <Button variant="contained" onClick={() => playText(e.start)}>
                    텍스트 재생
                  </Button>
                  <Button variant="contained" onClick={() => handleTextOpen()}>
                    텍스트 편집
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => textLocation(e.id, e.isMine)}
                  >
                    텍스트 위치 변환
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleBookMark(e.id, e.isHighlighted)}
                  >
                    {e.isHighlighted ? "북마크 제거" : "북마크 추가"}
                  </Button>
                  <Dialog
                    open={editTextOpen}
                    onClose={() => handleTextClose()}
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
                      <Button onClick={() => handleTextClose()}>취소</Button>
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
        </div>
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
      <Grid item xs={10}>
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
            aud.playbackRate = 1;
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <FormControl>
          <InputLabel id="playSpeed">재생 속도</InputLabel>
          <Select
            labelId="playSpeed"
            onChange={(e) => handleChange(e)}
            defaultValue={1}
          >
            <MenuItem value={0.8}>0.8</MenuItem>
            <MenuItem defaultChecked value={1}>
              1
            </MenuItem>
            <MenuItem value={1.2}>1.2</MenuItem>
            <MenuItem value={1.5}>1.5</MenuItem>
            <MenuItem value={1.8}>1.8</MenuItem>
            <MenuItem value={2.0}>2.0</MenuItem>
          </Select>
          <FormHelperText>클릭해 배속 조절</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <MessageInput
          attachButton={false}
          placeholder="여기에 질문을 입력해보세요"
          onSend={(e) => handleValue(e)}
        />
      </Grid>
      <PopupDialog
        title="질문"
        content={questionBlock}
        open={!!questionBlock}
        handleClose={() => handleDialogClose()}
      />
    </Grid>
  );
};

export default PlayingRecord;
