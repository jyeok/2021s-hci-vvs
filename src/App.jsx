import React from "react";

import Explorer from "explorer/Explorer";
import WhileRecording from "WhileRecording/WhileRecording";
import PlayingRecord from "container/PlayingRecord/PlayingRecord";

// import RawRecorder from "recorder/Recorder";

function App() {
  return (
    <div className="App">
      <Explorer />
      <WhileRecording />
      <PlayingRecord />
      {/* <RawRecorder /> */}
    </div>
  );
}

export default App;
