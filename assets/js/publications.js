import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import PublicationSearch from './publications/search.js'

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