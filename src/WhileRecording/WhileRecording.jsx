import React, { PureComponent } from "react";
import { Grid, TextField } from "@material-ui/core";
import { Delete, SaveAlt } from "@material-ui/icons";
import { ReactMic } from "react-mic";
import RecordingMessage from "../container/RecordingMessage/RecordingMessage";

class WhileRecording extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      record: false,
    };
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onData(recordedBlob) {
    console.log("chunk of real-time data is: ", recordedBlob);
  }

  // eslint-disable-next-line class-methods-use-this
  onStop(recordedBlob) {
    console.log("recordedBlob is: ", recordedBlob);
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
          style={({ borderBottom: "0.5px solid" }, { height: "100px" })}
        >
          <ReactMic
            record={record}
            className="sound-wave"
            onStop={this.onStop}
            onData={this.onData}
            strokeColor="#000000"
            visualSetting="False"
          />
          <button onClick={this.startRecording} type="button">
            Start
          </button>
          <button onClick={this.stopRecording} type="button">
            Stop
          </button>
        </Grid>
        <Grid
          item
          xs={8}
          style={({ height: "500px" }, { borderRight: "0.5px solid" })}
        >
          <Grid style={{ height: "600px" }}>
            <RecordingMessage />
            <Delete />
            <SaveAlt />
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ height: "500px" }}>
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
      </Grid>
    );
  }
}

export default WhileRecording;
