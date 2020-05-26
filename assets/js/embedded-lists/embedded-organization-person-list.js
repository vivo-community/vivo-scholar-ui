import '../elements/person-image.js';
import '../elements/person-card.js';
import '../elements/truncated-text-result.js';


import { LitElement, html, css } from 'lit-element';


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
      type: { type: String }
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
    this.type = this.getAttribute("type");
    this.organization = this.getAttribute("organization");
}

  connectedCallback() {
    super.connectedCallback();
    const data = client.query({
      query: ORG_QUERY,
      variables: {
        //here get attribute person_url then strip all but the last bit for the id
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
      <vivo-person-card-image thumbnail="${p.thumbnail}"></vivo-person-card-image>
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
  customElements.define('vivo-embedded-organization-people-list', EmbeddedOrgPeopleList)
