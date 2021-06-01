/* eslint-disable*/
import React, { useState, useEffect } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { Delete, SaveAlt, ArrowBack, RadioRounded } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { ReactMic } from "react-mic";

import { getTextBlocks } from "api/ai/simpleTTS";
import { mutations } from "api/gql/schema";

import RecordingMessage from "../../container/RecordingMessage/RecordingMessage";

const splitBase64String = (base64String) => {
  const [dataType, codecs, encoding, data] = base64String.split(/;|,/);

  return {
    dataType,
    codecs,
    encoding,
    data,
  };
};

const onStop = async (data, setVoice, setTextBlockData) => {
  const { blob } = data;
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Data = splitBase64String(reader.result);
    const { dataType, codecs, encoding, data } = base64Data;
    const textBlockData = await generateTextBlock(base64Data);

    setVoice(data);
    setTextBlockData(textBlockData);

    console.log("dataType :>> ", dataType);
    console.log("codecs :>> ", codecs);
    console.log("encoding :>> ", encoding);
    console.log("data :>> ", data);
    console.log("textBlockData :>> ", textBlockData);
  };

  reader.readAsDataURL(blob);
};

const onInputChange = (e, inputState, setInputState) => {
  const name = e.target.name;
  const newInputState = {
    ...inputState,
  };
  newInputState[name] = e.target.value;

  setInputState(newInputState);
};

const onSave = (e, inputData, textBlockData, voice) => {
  if (!voice) alert("녹음이 완료되지 않았습니다!");
  else {
    console.log("e :>> ", e);
    console.log("inputData :>> ", inputData);
    console.log("textBlockData :>> ", textBlockData);
    console.log("voice :>> ", voice);
  }
};

const generateTextBlock = async (base64Data) => {
  const { data, dataType, codecs, encoding } = base64Data;

  const textBlocks = await getTextBlocks(data, dataType, codecs, encoding);

  return textBlocks;
};

export const WhileRecording = () => {
  const history = useHistory();

  const [inputState, setInputState] = useState({
    title: "",
    memo: "",
    tag: "",
  });
  const [recording, setRecording] = useState(false);
  const [textBlockData, setTextBlockData] = useState([]);
  const [voice, setVoice] = useState(undefined);

  const { title, memo, tag } = inputState;

  const inputChangeHandler = (e) => onInputChange(e, inputState, setInputState);
  const goBackHandler = () => history.goBack();

  return (
    <Grid container padding={15} style={{ border: "1px solid" }}>
      <Grid
        item
        xs={1}
        style={({ height: "150px" }, { borderBottom: "0.5px solid" })}
      >
        <ArrowBack
          fontSize="large"
          onClick={goBackHandler}
          style={{ marginTop: "5px" }}
        />
      </Grid>
      <Grid
        item
        xs={11}
        style={({ height: "150px" }, { borderBottom: "0.5px solid" })}
      >
        <TextField
          size="small"
          error={title === ""}
          label="제목"
          onChange={inputChangeHandler}
          value={title}
          name="title"
          placeholder="제목을 입력해주세요."
        />
      </Grid>
      <Grid
        item
        xs={8}
        style={({ height: "600px" }, { borderRight: "0.5px solid" })}
      >
        <Grid style={({ height: "5500px" }, { borderBottom: "0.5px solid" })}>
          <RecordingMessage />
          <Delete fontSize="large" onClick={goBackHandler} />
          <SaveAlt
            fontSize="large"
            onClick={(e) => onSave(e, inputState, textBlockData, voice)}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={4}
        style={({ height: "600px" }, { borderBottom: "0.5px solid" })}
      >
        <div style={{ margin: "10px" }}>
          메모
          <TextField
            variant="outlined"
            multiline
            rows={15}
            placeholder="여기에 메모를 입력하세요."
            fullWidth
            name="memo"
            value={memo}
            onChange={inputChangeHandler}
          />
        </div>
        <div style={{ margin: "10px" }}>
          키워드
          <TextField
            variant="outlined"
            multiline
            rows={8}
            placeholder="녹음이 종료되면 키워드가 생성됩니다. 직접 추가할 수도 있습니다."
            fullWidth
            name="tag"
            value={tag}
            onChange={inputChangeHandler}
          />
        </div>
      </Grid>
      <Grid
        item
        xs={10}
        style={({ borderBottom: "0.5px solid" }, { height: "120px" })}
      >
        <ReactMic
          record={recording}
          onStop={(data) => onStop(data, setVoice, setTextBlockData)}
          strokeColor="#000000"
          visualSetting="frequencyBars"
        />
      </Grid>
      <Grid
        item
        xs={2}
        style={({ borderBottom: "0.5px solid" }, { height: "120px" })}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => setRecording(true)}
          style={{ marginTop: "20%", marginRight: "5px" }}
        >
          Start
        </Button>
        <Button
          onClick={() => setRecording(false)}
          color="primary"
          variant="contained"
          style={{ marginTop: "20%" }}
        >
          Stop
        </Button>
      </Grid>
    </Grid>
  );
};

export default WhileRecording;
