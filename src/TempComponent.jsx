/* eslint-disable */

import React, { Component } from "react";
import AudioStreamer from "./Util";

class TempComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recording: false,
    };

    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  onStart() {
    if (this.props.onStart) {
      this.props.onStart();
    }

    this.setState({
      recording: true,
    });

    AudioStreamer.initRecording(
      (data) => {
        // if (this.props.onUpdate) {
        //   this.props.onUpdate(data);
        // }
      },
      (error) => {
        console.error("Error when recording", error);
        this.setState({ recording: false });
        // No further action needed, as this already closes itself on error
      }
    );
  }

  onStop() {
    this.setState({ recording: false });
    AudioStreamer.stopRecording();
    if (this.props.onStop) {
      this.props.onStop();
    }
  }

  render() {
    return (
      <div>
        <button onClick={() => this.onStart()}> Click </button>
        <button onClick={() => this.onStop()}> Stop </button>
      </div>
    );
  }
}

export default TempComponent;
