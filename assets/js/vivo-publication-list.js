import { LitElement, html, css } from 'lit-element';
import './elements/publication';
import './elements/publication-list';
import './elements/publication-author-list';
import './elements/publication-author';
import './elements/vaadin-theme.js';

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
    person(id: $id) {
      id
      publications {
        id
        title
        abstractText
        doi
        authorList
        authors {
          id
          label
        }
        publicationDate
        publisher {
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
      this.publications = data.person.publications
    });
  }

  authorTemplate(author) {
    return html`
      <vivo-publication-author profile-url="/entities/person/${author.id}">
        ${author.label}
      </vivo-publication-author>
    `
  }

  publisherTemplate(publisher) {
    if (publisher) {
      return html`
        <span slot="publisher">${publisher.label}</span>
      `
    }
  }

  abstractTemplate(abstract) {
    if (abstract) {
      return html`
      <vivo-truncated-text slot="abstract">${abstract}</vivo-truncated-text>
      `
    }
  }

  publicationTemplate(p) {
    let pubDate = new Date(p.publicationDate);
    // TODO: would probably want to get locale from something
    let dateFormatted = pubDate.toLocaleDateString("en-US");;

    return html`
      <vivo-publication publication-url="/entities/publication/${p.id}" link-decorate="${this.linkDecorate}">
        <div slot="title">${p.title}</div>
        <vivo-publication-author-list slot="authors">
        ${p.authors.map((a) => this.authorTemplate(a))}
        </vivo-publication-author-list>
        ${this.publisherTemplate(p.publisher)}
        <span slot="date">${dateFormatted}</span>
        ${this.abstractTemplate(p.abstractText)}
      </vivo-publication>
    `
  }

  render() {
    let publicationElements = this.publications.map((p) => this.publicationTemplate(p));
    return html`
      <vivo-publication-list>
        ${publicationElements}
      </vivo-publication-list>
    `
  }

}

customElements.define('vivo-embedded-publication-list', EmbeddedPublicationList)