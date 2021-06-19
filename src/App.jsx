import React from "react";
import PropTypes from "prop-types";
import { Switch, Redirect, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "@apollo/client";
import { SnackbarProvider } from "notistack";

import Explorer from "component/explorer/Explorer";
import StreamRecord from "component/Recorder/StreamRecord";
import PlayingLayout from "container/PlayingRecord/PlayingLayout";
import temp from "component/temp";

function App(props) {
  const { client } = props;

  return (
    <ApolloProvider client={client}>
      <SnackbarProvider maxSnack={3}>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Explorer} />
            <Route path="/recording" exact component={StreamRecord} />
            <Route path="/playing/:id" exact component={PlayingLayout} />
            <Route path="/temp" exact component={temp} />
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
