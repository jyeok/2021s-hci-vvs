/* eslint-disable no-console */
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  from,
} from "@apollo/client";

// eslint-disable-next-line import/no-extraneous-dependencies
import { onError } from "@apollo/client/link/error";

import App from "App";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

setChonkyDefaults({ iconComponent: ChonkyIconFA });

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App client={client} />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
