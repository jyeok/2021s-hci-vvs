/* eslint-disable*/
import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import { Grid, TextField, IconButton } from "@material-ui/core";
import { Delete, SaveAlt, ArrowBack } from "@material-ui/icons";

import { ReactMic } from "react-mic";

import { upload } from "api/ai/simpleTTS";

import RecordingMessage from "../../container/RecordingMessage/RecordingMessage";

class WhileRecording extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false,
      textBlocks: null,
    };

    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);

    this.blobToBase64 = this.blobToBase64.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  onStop(recordedBlob) {
    this.blobToBase64(recordedBlob.blob);
  }

  async blobToBase64(blob) {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result;
      const [dataType, codecs, encoding, data] = base64data.split(/;|,/);
      const textBlocks = await upload(data, dataType, codecs, encoding);

      console.log("textBlocks :>> ", textBlocks);
      this.setState({ textBlocks });
    };

    reader.readAsDataURL(blob);
  }

  startRecording() {
    this.setState({ record: true });
  }

  stopRecording() {
    this.setState({ record: false });
  }

  render() {
    const { record } = this.state;

    return (
      <Grid container padding={15} style={{ border: "1px solid" }}>
        <Grid
          item
          xs={12}
          style={({ height: "150px" }, { borderBottom: "0.5px solid" })}
        >
          <ArrowBack fontsize="large" />
          <TextField label="제목" />
        </Grid>
        <Grid
          item
          xs={8}
          style={({ height: "600px" }, { borderRight: "0.5px solid" })}
        >
          <Grid style={({ height: "5500px" }, { borderBottom: "0.5px solid" })}>
            <RecordingMessage />
            <Delete fontSize="large" />
            <SaveAlt fontSize="large" />
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          style={({ height: "600px" }, { borderBottom: "0.5px solid" })}
        >
          <div>메모</div>
          <TextField
            variant="outlined"
            name="메모"
            style={({ margin: "10px" }, { width: "90%" })}
            multiline
            rows={15}
            defaultValue="여기에 메모를 입력하세요."
            fullWidth
          />
          <div>키워드</div>
          <TextField
            variant="outlined"
            name="키워드"
            style={({ margin: "10px" }, { width: "90%" })}
            multiline
            rows={8}
            defaultValue="키워드가 이곳에 나타납니다. 여기를 눌러 수정도 가능합니다."
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          style={({ borderBottom: "0.5px solid" }, { height: "120px" })}
        >
          <ReactMic
            record={record}
            onStop={this.onStop}
            onData={this.onData}
            strokeColor="#000000"
            visualSetting="sinewave"
          />
          <button onClick={this.startRecording} type="button">
            Start
          </button>
          <button onClick={this.stopRecording} type="button">
            Stop
          </button>
        </Grid>
      </Grid>
    );
  }
}

export default WhileRecording;
