import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ReactMic } from "react-mic";

import { Grid, TextField, Button } from "@material-ui/core";
import { Delete, SaveAlt, ArrowBack } from "@material-ui/icons";

import { getTextBlocks } from "api/ai/simpleTTS";
import { mutations } from "api/gql/schema";

import RecordingMessage from "../../container/RecordingMessage/RecordingMessage";

const generateTextBlock = async (base64Data) => {
  const { data, dataType, codecs, encoding } = base64Data;
  const textBlocks = await getTextBlocks(data, dataType, codecs, encoding);

  return textBlocks;
};

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
    const { data: voiceData } = base64Data;
    const textBlockData = await generateTextBlock(base64Data);

    setVoice(voiceData);
    setTextBlockData(textBlockData);
  };

  reader.readAsDataURL(blob);
};

const onInputChange = (e, inputState, setInputState) => {
  const { name } = e.target;
  const newInputState = {
    ...inputState,
  };
  newInputState[name] = e.target.value;

  setInputState(newInputState);
};

const onSave = async (
  inputData,
  textBlockData,
  voiceData,
  addRecordMutation,
  goBackHandler
) => {
  if (!voiceData) alert("녹음이 완료되지 않았습니다!");
  if (!inputData.title) alert("제목을 입력하세요!");
  // TODO: change to popup
  else {
    const textBlockCreateInput = textBlockData.map((block) => ({
      content: block.content,
      isMine: 1,
      isHighlighted: 0,
      isModified: 0,
      reliability: block.reliability,
      start: block.start,
      end: block.end,
    }));

    const recordCreateInput = {
      path: inputData.title,
      title: inputData.title,
      size: Number.parseInt(Math.ceil((voiceData.length * 3) / 4 - 2), 10),
      tag: inputData.tag,
      memo: inputData.memo,
      voice: voiceData,
      content: textBlockCreateInput,
    };

    const res = await addRecordMutation({
      variables: {
        data: recordCreateInput,
      },
    });

    console.log("res :>> ", res);

    goBackHandler();
  }
};

const WhileRecording = () => {
  const history = useHistory();

  const [inputState, setInputState] = useState({
    title: "",
    memo: "",
    tag: "",
  });
  const [recording, setRecording] = useState(false);
  const [textBlockData, setTextBlockData] = useState([]);
  const [voice, setVoice] = useState(undefined);

  const [addRecordMutation] = useMutation(mutations.addRecord);

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
            onClick={() =>
              onSave(
                inputState,
                textBlockData,
                voice,
                addRecordMutation,
                goBackHandler
              )
            }
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
