import React from 'react'
import ReactDOM from 'react-dom'

import PublicationSearch from './publications/search.js'

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
  
function App() {
  return (
      <div>
        <PublicationSearch />
      </div>
    )
}
  
// Router/ PublicationSearch
ReactDOM.render(
  <App />,
  document.getElementById('search')
);