import React from "react";
import { Route } from "react-router-dom";

import Explorer from "explorer/Explorer";
import WhileRecording from "WhileRecording/WhileRecording";
import PlayingRecord from "container/PlayingRecord/PlayingRecord";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={Explorer} />
      <Route path="/recording" exact component={WhileRecording} />
      <Route path="/playing" exact component={PlayingRecord} />
    </div>
  );
}

export default App;
