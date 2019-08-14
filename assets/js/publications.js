import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ApolloClient from 'apollo-boost'

import PublicationSearch from './publications/search.js'

// TODO: get url from .env --- could make a route
// to return them e.g. fetch("/environment")
const client = new ApolloClient({
  uri: 'http://localhost:9000/graphql',
});

function App() {
  return (
    <Router>
      <Route exact path="/search/publications" component={PublicationSearch} />
    </Router>
    )
}

ReactDOM.render(
  <App />,
  document.getElementById('search')
);