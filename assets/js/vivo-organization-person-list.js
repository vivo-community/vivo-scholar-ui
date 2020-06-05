import { LitElement, html, css } from 'lit-element';

import './elements/person-image.js';
import './elements/person-card.js';
import './elements/truncated-text-result.js';

import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

const ORG_QUERY = gql`
  query($filters: [FilterArgInput]) {
    people(filters: $filters, query: {q: "*", bq: "type:(*FacultyMember)^2.0"}) {
    content {
      id
      name
      keywords
      thumbnail
      preferredTitle
      overview
      }
    }
}

`
class EmbeddedOrgPeopleList extends LitElement {

  static get properties() {
    return {
      people: { type: Array },
      organization: { type: String },
      type: { type: String },
      endpoint: { type: String }
    }
  }

  static get styles(){
    return css `
    .people {
        display: block;
        padding: 1em;
    }
    .person {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    vivo-person-card-image {
        flex-shrink: 1;
        flex-basis: 10%;
        padding: 0.2em;
    }
    vivo-person-card {
        flex-shrink: 3;
        flex-basis: 90%;
        padding: 0.2em;
        --lh: 1.2rem;
        line-height: var(--lh);
    }
    #overview {
        width: 75%;
    }
    `
  }

  constructor() {
    super();
    this.people = [];
  }

  connectedCallback() {
    this.type = this.getAttribute("type");
    this.organization = this.getAttribute("organization");
    this.defaultImage = this.getAttribute("default-image");

    super.connectedCallback();
    this.client = new ApolloClient({
        uri: this.endpoint,
        fetchOptions: {
          useGETForQueries: true
        }
    });
    const data = this.client.query({
      query: ORG_QUERY,
      variables: {
        filters:  {field: this.type, opKey: "EQUALS", tag: this.type, value: this.organization}
      }
    }).then(({data}) =>  {
      let peopleData = data.people.content;
      this.people = peopleData.sort(function(a, b) {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
            });
    });
  }

  orgPersonTemplate(p) {
    return html`
    <div class="people">
      <div class="person">
      <vivo-person-card-image default="${this.defaultImage}" thumbnail="${p.thumbnail}"></vivo-person-card-image>
      <vivo-person-card>
        <div slot="title">${p.preferredTitle}</div>
        <a slot="name" href="/entities/person/${p.id}">${p.name}</a>
        <div id="overview">
          <vivo-search-truncated-text-result text="${p.overview}"></vivo-search-truncated-text-result>
        </div>
        </vivo-person-card>
      </div>
    </div>
    `
  }


  render() {
    let peopleElements = this.people.map((p) => this.orgPersonTemplate(p));
    return html`
    ${peopleElements}
    `
  }
}
  
customElements.define('vivo-embedded-organization-people-list', EmbeddedOrgPeopleList);
