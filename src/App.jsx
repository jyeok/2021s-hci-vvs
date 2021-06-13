import React from "react";
import PropTypes from "prop-types";
import { Switch, Redirect, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "@apollo/client";
import { SnackbarProvider } from "notistack";

import WhileRecording from "component/Recorder/WhileRecording";
import PlayingRecord from "container/PlayingRecord/PlayingRecord";
import Explorer from "component/explorer/Explorer";
import StreamRecord from "component/Recorder/StreamRecord";

function App(props) {
  const { client } = props;

  return (
    <ApolloProvider client={client}>
      <SnackbarProvider maxSnack={3}>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Explorer} />
            <Route path="/legacy" exact component={WhileRecording} />
            <Route path="/playing/:id" exact component={PlayingRecord} />
            <Route path="/recording" exact component={StreamRecord} />
            <Redirect path="*" to="/" />
          </Switch>
        </div>
      </SnackbarProvider>
    </ApolloProvider>
  );
}

export default App;

App.propTypes = {
  client: PropTypes.instanceOf(ApolloClient).isRequired,
};
