import React, { Component } from "react";

class SearchBox extends Component {

  constructor(props) {
    super(props);
    this.searchBoxRef = React.createRef();
    this.handleSearchSubmitted = this.handleSearchSubmitted.bind(this);
  }

  componentDidMount() {
    this.searchBoxRef.current.addEventListener('searchSubmitted', this.handleSearchSubmitted)
  }

  componentWillUnmount() {
    this.searchBoxRef.current.removeEventListener('searchSubmitted', this.handleSearchSubmitted)
  }

  handleSearchSubmitted(e) {
    let query = e.detail;
    this.props.handleQueryChange(query);
    this.props.handleSubmit(e);
  }

  render() {
    return (
      <vivo-site-search-box ref={this.searchBoxRef} class="site-search" query={this.props.query} action={this.props.action} external-submit={true}>
        {this.props.children}
      </vivo-site-search-box>
    )
  }

}

export default SearchBox;

