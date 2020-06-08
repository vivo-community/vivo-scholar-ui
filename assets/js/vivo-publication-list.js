import { LitElement, html, css } from 'lit-element';
import './elements/publication';
import './elements/publication-list';
import './elements/publication-author-list';
import './elements/publication-author';
import './elements/sortable-list';

import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

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
class EmbeddedPublicationList extends LitElement {

  static get properties() {
    return {
      publications: { type: Array },
      i18n: { type: Object },
      endpoint: { type: String, reflect: true }
    }
  }

  constructor() {
    super();
    this.publications = [];
    this.i18n = {};
  }

  connectedCallback() {
    super.connectedCallback();
    let person_id = this.getAttribute("person-id");
    this.client = new ApolloClient({
      uri: this.endpoint,
      fetchOptions: {
        useGETForQueries: true
      }
    });
    const data = this.client.query({
      query: PUBLICATION_QUERY,
      variables: {
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
          published-date="${p.publicationDate}" title="${p.title}">
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
    // NOTE: up to client to set these labels however there are done in system/language
    let oldestFirstLabel = this.i18n['oldest_first'] ? this.i18n['oldest_first'] : 'Oldest First';
    let newestFirstLabel = this.i18n['newest_first'] ? this.i18n['newest_first'] : 'Newest First';
    let pubAtoZLabel = this.i18n['publication_a_z'] ? this.i18n['publication_a_z'] : 'Publication a-z';
    let pubZtoALabel = this.i18n['publication_z_a'] ? this.i18n['publication_z_a'] : 'Publication z-a';
    let showingLabel = this.i18n['showing'] ? this.i18n['showing'] : 'Showing';
    let ofLabel = this.i18n['of'] ? this.i18n['of'] : 'of';
    let showingAllLabel = this.i18n['showing_all'] ? this.i18n['showing_all'] : 'Showing All';

    return html`
      <vivo-sortable-list item-type="publications" sortProperty="publishedDate" sortDirection="desc">
        <vivo-sort-option field="publishedDate" direction="asc" label="${oldestFirstLabel}"></vivo-sort-option>
        <vivo-sort-option field="publishedDate" direction="desc" label="${newestFirstLabel}"></vivo-sort-option>
        <vivo-sort-option field="title" direction="asc" label="${pubAtoZLabel}"></vivo-sort-option>
        <vivo-sort-option field="title" direction="desc" label="${pubZtoALabel}"></vivo-sort-option>
        <!-- remaining labels (not sort) -->
        <vivo-i18n-label key="showing" label="${showingLabel}"></vivo-i18n-label>
        <vivo-i18n-label key="of" label="${ofLabel}"></vivo-i18n-label>
        <vivo-i18n-label key="showing_all" label="${showingAllLabel}"></vivo-i18n-label>
        ${publicationElements}
      </vivo-sortable-list>
    `
  }
}

customElements.define('vivo-embedded-publication-list', EmbeddedPublicationList);
