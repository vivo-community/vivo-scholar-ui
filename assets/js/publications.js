import React from 'react'
import ReactDOM from 'react-dom'

import PublicationSearch from './publications/search.js'

import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
  
// <PublicationSearch />
function App() {
  return (
    <Router>
      <Route exact path="/search/publications" component={PublicationSearch} />
    </Router>
    )
}
  
// Router/ PublicationSearch
ReactDOM.render(
  <App />,
  document.getElementById('search')
);