import React, { PureComponent } from "react";
import { Grid } from "@material-ui/core";
import { Delete, SaveAlt } from "@material-ui/icons";
import { ReactMic } from "react-mic";

import RecordingKeyword from "component/RecordingKeyword/RecordingKeyword";
import RecordingMemo from "../component/RecordingMemo/RecordingMemo";
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
        <Grid item xs={12} style={{ borderBottom: "0.5px solid" }}>
          <ReactMic
            record={record}
            className="sound-wave"
            onStop={this.onStop}
            onData={this.onData}
            strokeColor="#000000"
            backgroundColor="#FF4081"
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
          style={({ height: "600px" }, { borderRight: "0.5px solid" })}
        >
          <Grid style={{ height: "600px" }}>
            <RecordingMessage messageTalk="아아아" />
            <Delete />
            <SaveAlt />
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ height: "600px" }}>
          <div>
            <RecordingMemo
              style={{
                border: "0.5px solid",
              }}
            />
          </div>
          <p2>
            <RecordingKeyword keyword="키워드" />
          </p2>
        </Grid>
      </Grid>
    );
  }
}

export default WhileRecording;
