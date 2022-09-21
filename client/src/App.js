import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// inporting from Apollo Client after installing the library
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

//new link to GraphQL server
const httpLink = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={SearchBooks} />
          <Route exact path="/saved" component={SavedBooks} />
          <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
        </Switch>
      </>
    </ApolloProvider>
  );
}

export default App;
