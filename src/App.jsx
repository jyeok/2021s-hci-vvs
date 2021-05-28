import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "@apollo/client";

import WhileRecording from "WhileRecording/WhileRecording";
import PlayingRecord from "container/PlayingRecord/PlayingRecord";
import { Explorer } from "explorer/Explorer";

function App(props) {
  const { client } = props;

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Route path="/" exact>
          <Explorer client={client} />
        </Route>
        <Route path="/recording" exact>
          <WhileRecording client={client} />
        </Route>
        <Route path="/playing" exact>
          <PlayingRecord client={client} />
        </Route>
      </div>
    </ApolloProvider>
  );
}

export default App;

App.propTypes = {
  client: PropTypes.instanceOf(ApolloClient).isRequired,
};
