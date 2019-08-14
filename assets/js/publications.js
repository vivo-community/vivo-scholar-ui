import React from 'react'
import ReactDOM from 'react-dom'

import PublicationSearch from './publications/search.js'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import { ApolloProvider } from '@apollo/react-hooks';


import ApolloClient from 'apollo-boost'

// TODO: get url from env
const client = new ApolloClient({
  uri: 'http://localhost:9000/graphql',
});


/*
const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app 🚀</h2>
    </div>
  </ApolloProvider>
);
*/
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