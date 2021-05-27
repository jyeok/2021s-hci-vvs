import React, { PureComponent } from "react";

import { ArrowBack } from "@material-ui/icons/";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

class RecordingTop extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      recordState: null,
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onStop(audioData) {
    console.log("audioData", audioData);
  }

  start() {
    this.setState({
      recordState: RecordState.START,
    });
  }

  stop() {
    this.setState({
      recordState: RecordState.STOP,
    });
  }

  render() {
    const { recordState } = this.state;

    return (
      <div>
        <ArrowBack />
        <AudioReactRecorder
          state={recordState}
          onStop={this.onStop}
          canvasWidth={0}
          canvasHeight={0}
        />

        <button type="button" onClick={this.start}>
          Start
        </button>
        <button type="button" onClick={this.stop}>
          Stop
        </button>
      </div>
    );
  }
}

export default RecordingTop;
