import React from "react";
import Explorer from "explorer/Explorer";
import "./index.css";
import WhileRecording from "WhileRecording/WhileRecording";

// import RawRecorder from "recorder/Recorder";

function App() {
  return (
    <div className="App">
      <Explorer />
      <WhileRecording />

      {/* <RawRecorder /> */}
    </div>
  );
}

export default App;
