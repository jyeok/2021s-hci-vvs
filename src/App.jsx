import React from "react";
import { Route } from "react-router-dom";
import "./index.css";

import Explorer from "explorer/Explorer";
import WhileRecording from "WhileRecording/WhileRecording";
import PlayingRecord from "container/PlayingRecord/PlayingRecord";

import Explorer from "explorer/Explorer";
import WhileRecording from "WhileRecording/WhileRecording";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={Explorer} />
      <Route path="/recording" exact component={WhileRecording} />
      <Explorer />
      <WhileRecording />
      <PlayingRecord />
    </div>
  );
}

export default App;
