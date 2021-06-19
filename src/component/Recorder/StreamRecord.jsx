/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useElapsedTime } from "use-elapsed-time";

import { useSnackbar } from "notistack";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import { PlayArrow, Save, ArrowBack, Stop } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ReactMic } from "react-mic";

import { compression } from "api/ai/compression";
import { mutations } from "api/gql/schema";

import RecordingMessage from "container/RecordingMessage/RecordingMessage";
import AudioStreamer from "./AudioStream";
import { secondsToTime, splitBase64String } from "./Util";

const useStyles = makeStyles(() => ({
  topElements: {
    height: "50px",
  },
}));

const onInputChange = (e, inputState, setInputState) => {
  const { name } = e.target;
  const newInputState = {
    ...inputState,
  };
  newInputState[name] = e.target.value;

  setInputState(newInputState);
};

const StreamRecord = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [recording, setRecording] = useState(false);
  const [inputState, setInputState] = useState({
    title: "",
    memo: "",
    tag: "",
  });
  const [newData, setNewData] = useState();
  const [textBlockData, setTextBlockData] = useState([]);
  const [interimString, setInterimString] = useState("");
  const [voice, setVoice] = useState(undefined);
  const [status, setStatus] = useState("");

  const [addRecordMutation] = useMutation(mutations.addRecord);
  const [generatePreviewMutation] = useMutation(mutations.generatePreview);

  const classes = useStyles();
  const { elapsedTime } = useElapsedTime(recording);

  const { title, memo, tag } = inputState;

  const inputChangeHandler = (e) => onInputChange(e, inputState, setInputState);
  const goBackHandler = () => history.goBack();

  const onStart = () => {
    AudioStreamer.initRecording(
      (data) => {
        setNewData(data);
        setInterimString("");
      },
      () => {
        enqueueSnackbar("녹음 중 오류가 발생했습니다! 새로고침해 주세요.", {
          variant: "error",
        });
        setStatus("error");
        setRecording(false);
      },
      (data) => {
        setInterimString(data);
      }
    );

    setRecording(true);
    setStatus("recording");
  };

  const accumulateTextBlocks = (newTextBlock) => {
    if (textBlockData.length === 0) {
      setTextBlockData([newTextBlock]);
    } else {
      const lastBlock = textBlockData[textBlockData.length - 1];

      const start = lastBlock.end;
      const end = elapsedTime;

      const newTextBlockData = {
        ...newTextBlock,
        start,
        end: end.toFixed(2),
      };

      setTextBlockData([...textBlockData, newTextBlockData]);
      setNewData();
    }
  };

  const onStop = (data) => {
    const { blob } = data;
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Data = splitBase64String(reader.result);
      const { data: voiceData } = base64Data;
      setVoice(voiceData);
      setStatus("ready");
    };

    reader.readAsDataURL(blob);
  };

  useEffect(() => {
    if (newData) accumulateTextBlocks(newData);
  }, [newData]);

  const onSave = async () => {
    if (!inputState.title) {
      enqueueSnackbar("녹음 제목을 입력해주세요.", {
        variant: "error",
      });
    } else {
      const textBlockCreateInput = textBlockData.map((block) => ({
        content: block.content,
        isMine: 1,
        isHighlighted: 0,
        isModified: 0,
        reliability: block.reliability,
        start: block.start,
        end: block.end,
      }));

      const allContents = textBlockData
        .reduce((acc, cur) => `${acc} ${cur.content}`, "")
        .trim();

      const userTag = inputState.tag.trim()
        ? inputState.tag
            .split(" ")
            .map((e) => (e.startsWith("#") ? e.trim() : `#${e.trim()}`))
        : [];

      const getTags = await compression(allContents);

      const tagList = getTags
        ? getTags.return_object.keylists.map((e) =>
            e.keyword.startsWith("#")
              ? e.keyword.trim()
              : `#${e.keyword.trim()}`
          )
        : [];

      const tagConcat = userTag.concat(tagList);
      const finalTag = [...new Set(tagConcat)].slice(0, 10).join(" ").trim();

      const recordCreateInput = {
        path: inputState.title,
        title: inputState.title,
        size: Number.parseInt(Math.ceil((voice.length * 3) / 4 - 2), 10),
        tag: finalTag,
        memo: inputState.memo,
        content: textBlockCreateInput,
        voice,
      };

      try {
        const res = await addRecordMutation({
          variables: {
            data: recordCreateInput,
          },
        });

        await generatePreviewMutation({
          variables: {
            id: res.data.addRecord.id,
          },
        });

        enqueueSnackbar("녹음이 완료되었습니다.", {
          variant: "success",
        });
        goBackHandler();
      } catch (err) {
        if (err.message.includes("Unique constraint failed")) {
          enqueueSnackbar("이미 존재하는 제목입니다. 제목을 수정해 주세요.", {
            variant: "error",
          });
        } else if (err.message.includes("Failed to fetch")) {
          enqueueSnackbar("인터넷 연결을 확인해 주세요.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(
            "알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.",
            {
              variant: "error",
            }
          );
        }
      }
    }
  };

  return (
    <Grid container>
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={0}
        direction="row"
        className={classes.topElements}
        style={{
          backgroundColor:
            status === "recording"
              ? "orange"
              : status === "ready"
              ? "skyblue"
              : status === "error"
              ? "red"
              : "",
          border: "1px solid",
          borderBottom: "0px",
        }}
      >
        <Grid item lg={1}>
          <Button
            onClick={goBackHandler}
            startIcon={<ArrowBack />}
            disabled={recording}
          >
            돌아가기
          </Button>
        </Grid>
        <Grid item lg={2}>
          <Typography variant="h5">
            녹음 시간: {secondsToTime(elapsedTime.toFixed(0))}
          </Typography>
        </Grid>
        <Grid item lg={4} />
        <Grid item lg={1} hidden>
          <ReactMic
            record={recording}
            onStop={(data) => onStop(data)}
            strokeColor="#000000"
            visualSetting={false}
          />
        </Grid>
        <Grid item lg={2}>
          <TextField
            error={title === ""}
            onChange={inputChangeHandler}
            value={title}
            name="title"
            placeholder="녹음 제목"
            variant="standard"
          />
        </Grid>
        <Grid item lg={1}>
          <Button
            startIcon={<PlayArrow />}
            color="primary"
            variant="contained"
            onClick={() => {
              onStart();
            }}
            disabled={status !== ""}
          >
            녹음 시작
          </Button>
        </Grid>
        <Grid item lg={1}>
          <Button
            startIcon={<Stop />}
            onClick={() => {
              setRecording(false);
              AudioStreamer.stopRecording();
            }}
            color="primary"
            variant="contained"
            disabled={status !== "recording"}
          >
            녹음 중지
          </Button>
        </Grid>
        <Grid item lg={1}>
          <Button
            disabled={status !== "ready"}
            startIcon={<Save />}
            color="primary"
            variant="contained"
            onClick={() =>
              onSave(
                inputState,
                textBlockData,
                voice,
                addRecordMutation,
                generatePreviewMutation,
                goBackHandler
              )
            }
          >
            녹음 저장
          </Button>
        </Grid>
      </Grid>
      <Grid container justify="center" alignItems="center" spacing={0}>
        <Grid item xs={8} style={{ height: "600px", border: "1px solid" }}>
          <RecordingMessage
            contents={textBlockData}
            setContents={setTextBlockData}
            listening={recording}
            interimString={interimString}
          />
        </Grid>
        <Grid
          item
          xs={4}
          style={{ height: "600px", border: "1px solid", overflow: "scroll" }}
        >
          <TextField
            label="메모"
            name="memo"
            value={memo}
            multiline
            rows={19}
            placeholder="여기에 메모를 입력하세요."
            fullWidth
            onChange={inputChangeHandler}
            style={{ marginTop: "5px" }}
          />
          <TextField
            label="태그"
            multiline
            rows={9}
            placeholder="녹음이 종료되면 키워드가 생성됩니다. 직접 추가할 수도 있습니다. 예시: #약속 #밥"
            name="tag"
            value={tag}
            fullWidth
            onChange={inputChangeHandler}
            style={{ marginTop: "5px" }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StreamRecord;
