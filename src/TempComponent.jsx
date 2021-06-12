/* eslint-disable */

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AudioStreamer from "./Util";

const onStart = (setRecording) => {
  // if (this.props.onStart) {
  //   this.props.onStart();
  // }

  setRecording(true);

  AudioStreamer.initRecording(
    (data) => {
      // if (this.props.onUpdate) {
      //   this.props.onUpdate(data);
      // }
    },
    (error) => {
      console.error("Error when recording", error);
      setRecording(false);
    }
  );
};

const onStop = (setRecording) => {
  setRecording(false);
  AudioStreamer.stopRecording();
  // if (this.props.onStop) {
  //   this.props.onStop();
  // }
};

const TempComponent = () => {
  const [recording, setRecording] = useState(false);
  return (
    <div>
      <button onClick={() => onStart(setRecording)}> Click </button>
      <button onClick={() => onStop(setRecording)}> Stop </button>
    </div>
  );
};

export default TempComponent;
