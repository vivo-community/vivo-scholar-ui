import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import PersonSearch from './people/search.js'

function App() {
  return (
    <Router>
      <Route exact path="/search/people" component={PersonSearch} />
    </Router>
    )
}

ReactDOM.render(
  <App />,
  document.getElementById('search')
);