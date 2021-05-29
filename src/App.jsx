import React from "react";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
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
          <Explorer />
        </Route>
        <Route path="/recording" exact>
          <WhileRecording />
        </Route>
        <Route path="/playing/:id" exact>
          <PlayingRecord />
        </Route>
        <Redirect to="/" />
      </div>
    </ApolloProvider>
  );
}

export default App;

App.propTypes = {
  client: PropTypes.instanceOf(ApolloClient).isRequired,
};
