import { LitElement, html, css } from 'lit-element';
import './elements/publication'
import './elements/publication-list'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

let endpoint = "https://scholars-discovery-scholars.cloud.duke.edu/graphql"
if (process.env.GRAPHQL_ENDPOINT != undefined) {
  endpoint = `${process.env.GRAPHQL_ENDPOINT}`
}

const client = new ApolloClient({
  uri: endpoint,
  fetchOptions: {
    useGETForQueries: true
  }
});

const PUBLICATION_QUERY = gql`
  query($id: String) {
    personById(id: $id) {
      id
      publications {
        id
        title
        abstractText
        doi
        publicationDate
        authors {
          id
          label
        }
      }
    }
  }
`

class EmbeddedPublicationList extends LitElement {

  static get properties() {
    return {
      publications: { type: Array },
      linkDecorate: { attribute: 'link-decorate', type: Boolean }
    }
  }

  constructor() {
    super();
    this.publications = [];
    this.linkDecorate = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const data = client.query({
      query: PUBLICATION_QUERY,
      variables: {
        id: this.getAttribute("person_id")
      }
    }).then(({data}) =>  {
      this.publications = data.personById.publications
    });
  }

  publicationElement(p) {
    let pubDate = new Date(p.publicationDate);
    // TODO: would probably want to get locale from something
    let dateFormatted = pubDate.toLocaleDateString("en-US");
    return html`
      <vivo-publication publication-id="${p.id}" authors="${JSON.stringify(p.authors)}" link-decorate="${this.linkDecorate}">
        <div slot="title">${p.title}</div>
        <span slot="date">${dateFormatted}</span>
        <div slot="abstract">${p.abstractText}</div>
      </vivo-publication>
    `
  }

  render() {
    let publicationElements = this.publications.map((p) => this.publicationElement(p));
    return html`
      <vivo-publication-list>
        ${publicationElements}
      </vivo-publication-list>
    `
  }

}

customElements.define('vivo-embedded-publication-list', EmbeddedPublicationList)
