/* eslint-disable*/
import React, { Component } from "react";
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
          <ArrowBack
            fontsize="large"
            onClick={() => this.props.history.goBack()}
          />
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
          <div style={{ margin: "10px" }}>
            메모
            <TextField
              variant="outlined"
              name="메모"
              multiline
              rows={15}
              placeholder="여기에 메모를 입력하세요."
              fullWidth
            />
          </div>
          <div style={{ margin: "10px" }}>
            키워드
            <TextField
              variant="outlined"
              name="키워드"
              multiline
              rows={8}
              placeholder="녹음이 종료되면 키워드가 생성됩니다. 직접 추가할 수도 있습니다."
              fullWidth
            />
          </div>
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
