import { LitElement, html, css } from 'lit-element';
import '../elements/publication';
import '../elements/publication-list';
import '../elements/publication-author-list';
import '../elements/publication-author';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';


import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

//is there a default endpoint?
let endpoint = " "
// let endpoint = "https://scholars-discovery-scholars.cloud.duke.edu/graphql"
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
class EmbeddedPubList extends LitElement {

  static get properties() {
    return {
      publications: { type: Array },
      person_url: { type: String}
    }
  }

  constructor() {
    super();
    this.publications = [];
  }

  connectedCallback() {
    super.connectedCallback();
    let person_url = this.getAttribute("person-url");
    let regex = /[n]\d+/g;
    let person_id = (person_url.match(regex)).toString();
    const data = client.query({
      query: PUBLICATION_QUERY,
      variables: {
        //here get attribute person_url then strip all but the last bit for the id
        id: person_id
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
      let abstractText = html`
        ${unsafeHTML(abstract)}
      `;
      return html`
      <vivo-truncated-text slot="abstract">${abstractText}</vivo-truncated-text>
      `
    }
  }

  publicationTemplate(p) {
    let pubDate = new Date(p.publicationDate);
    // TODO: would probably want to get locale from something
    let dateFormatted = pubDate.toLocaleDateString("en-US");
    return html`
      <vivo-publication publication-url="/entities/publication/${p.id}"
          published-date="${p.publicationDate}">
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
    <h2>test</h2>
      <vivo-sortable-list>
        ${publicationElements}
      </vivo-sortable-list>
    `
  }
}
  customElements.define('vivo-embedded-pub-list', EmbeddedPubList)
