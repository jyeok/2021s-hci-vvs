import React from "react";
import { Route } from "react-router-dom";

import Explorer from "explorer/Explorer";
import WhileRecording from "WhileRecording/WhileRecording";

import { ApolloProvider } from "react-apollo";

import PropTypes from "prop-types";
import { ApolloClient } from "@apollo/client";

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
      </div>
    </ApolloProvider>
  );
}

export default App;

App.propTypes = {
  client: PropTypes.instanceOf(ApolloClient).isRequired,
};
