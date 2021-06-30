/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useElapsedTime } from "use-elapsed-time";

import { useSnackbar } from "notistack";
import {
  Grid,
  TextField,
  Button,
  Typography,
  // ClickAwayListener,
  Tooltip,
} from "@material-ui/core";
import { PlayArrow, Save, ArrowBack, Stop, Help } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ReactMic } from "react-mic";

import { keywords } from "api/ai/keywords";
import { mutations } from "api/gql/schema";

import RecordingMessage from "container/RecordingMessage/RecordingMessage";
import { io } from "socket.io-client";
import { secondsToTime, splitBase64String } from "./Util";

let socket;

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

const RealtimeRecord = () => {
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
  const [openHelp, setOpenHelp] = useState(false);

  const [addRecordMutation] = useMutation(mutations.addRecord);
  const [generatePreviewMutation] = useMutation(mutations.generatePreview);

  const classes = useStyles();
  const { elapsedTime } = useElapsedTime(recording);

  const { title, memo, tag } = inputState;

  const inputChangeHandler = (e) => onInputChange(e, inputState, setInputState);
  const goBackHandler = () => history.goBack();

  const accumulateTextBlocks = (newTextBlock) => {
    const newTextBlockData = {
      ...newTextBlock,
      start: newTextBlock.start.toFixed(2),
      end: newTextBlock.end.toFixed(2),
    };

    setTextBlockData([...textBlockData, newTextBlockData]);
    setNewData();
  };

  const onData = (newTextBlock) => {
    setInterimString("");
    setNewData(newTextBlock[0]);
  };

  const onInterim = (newInterim) => {
    setInterimString(newInterim);
  };

  const onError = () => {
    enqueueSnackbar("녹음 중 오류가 발생했습니다! 새로고침해 주세요.", {
      variant: "error",
    });
    setStatus("error");
    setRecording(false);
  };

  const onStart = () => {
    socket = io("http://localhost:3003/", {
      reconnection: false,
    });

    socket.on("connect_error", () => {
      enqueueSnackbar(
        "녹음 서버와 연결할 수 없습니다. 인터넷 연결을 확인해 보세요.",
        {
          variant: "warning",
        }
      );
    });

    socket.on("connect", () => {
      enqueueSnackbar("녹음이 시작되었습니다.", {
        variant: "success",
      });

      socket.emit("startRecord");

      socket.on("recordError", (error) => {
        onError(error);
      });

      setRecording(true);
      setStatus("recording");

      socket.on("speechData", (data) => {
        onData(data);
      });

      socket.on("interimData", (data) => {
        onInterim(data);
      });
    });
  };

  const onStop = () => {
    socket.emit("endRecord");
    socket.offAny();
    setRecording(false);

    enqueueSnackbar("녹음이 종료되었습니다.", {
      variant: "success",
    });
  };

  const onSaveVoice = (data) => {
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

      const tagList = await keywords(allContents);

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

        enqueueSnackbar("녹음이 저장되었습니다.", {
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

  const withHelp = (rest, msg) => (
    <Tooltip
      arrow
      title={msg}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      PopperProps={{
        disablePortal: true,
      }}
      open={openHelp}
      onClick={() => setOpenHelp(false)}
      onClose={() => setOpenHelp(false)}
      onOpen={() => setOpenHelp(true)}
    >
      {rest}
    </Tooltip>
  );

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
          {withHelp(
            <Button
              onClick={goBackHandler}
              startIcon={<ArrowBack />}
              disabled={recording}
            >
              돌아가기
            </Button>,
            "녹음을 저장하지 않고 돌아갑니다."
          )}
        </Grid>
        <Grid item lg={2}>
          {withHelp(
            <Typography variant="h5">
              녹음 시간: {secondsToTime(elapsedTime.toFixed(0))}
            </Typography>,
            "현재 진행중인 녹음의 시간"
          )}
        </Grid>
        <Grid item lg={1}>
          <Tooltip
            title={`도움말을 ${
              openHelp ? "숨기려면 다시 " : "보려면"
            } 클릭하세요.`}
          >
            <Button
              onClick={() => {
                setOpenHelp(!openHelp);
              }}
              startIcon={<Help fontSize="large" />}
              size="40"
            />
          </Tooltip>
        </Grid>
        <Grid item lg={3} />
        <Grid item lg={1} hidden>
          <ReactMic
            record={recording}
            onStop={(data) => onSaveVoice(data)}
            strokeColor="#000000"
            visualSetting={false}
          />
        </Grid>
        <Grid item lg={2}>
          {withHelp(
            <TextField
              error={title === ""}
              onChange={inputChangeHandler}
              value={title}
              name="title"
              placeholder="녹음 제목"
              variant="standard"
            />,
            "녹음의 제목을 입력합니다."
          )}
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
              onStop();
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
        {withHelp(
          <Grid item xs={8} style={{ height: "600px", border: "1px solid" }}>
            <RecordingMessage
              contents={textBlockData}
              setContents={setTextBlockData}
              listening={recording}
              interimString={interimString}
            />
          </Grid>,
          "녹음 중인 메시지가 실시간으로 나타납니다. 메시지가 잘못 저장된 경우 저장한 후 수정할 수 있습니다."
        )}
        {withHelp(
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
          </Grid>,
          "메모와 키워드를 입력합니다. 이후에 수정/검색에 사용할 수 있습니다."
        )}
      </Grid>
    </Grid>
  );
};

export default RealtimeRecord;
