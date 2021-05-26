import React, { PureComponent } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";

class RecordingTop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: null,
          m: null,
          s: null,
        },
      },
    };
  }

  handleAudioStop(data) {
    console.log(data);
    this.setState({ audioDetails: data });
  }

  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    this.setState({ audioDetails: reset });
  }

  render() {
    return (
      <div className="RecordingTop">
        <Recorder
          record
          title="New recording"
          // eslint-disable-next-line react/destructuring-assignment
          audioURL={this.state.audioDetails.url}
          showUIAudio
          handleAudioStop={(data) => this.handleAudioStop(data)}
          handleAudioUpload={(data) => this.handleAudioUpload(data)}
          handleReset={() => this.handleReset()}
        />
      </div>
    );
  }
}

export default RecordingTop;
