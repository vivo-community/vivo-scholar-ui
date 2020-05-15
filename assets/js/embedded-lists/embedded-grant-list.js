import { LitElement, html, css } from 'lit-element';
import '../elements/grant';
import '../elements/interval';


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

const GRANT_QUERY = gql`
  query($id: String) {
    person(id: $id) {
      id
      researcherOn{
       id
       label
       awardedBy{
         label
       }
       startDate
       endDate
     }

    }
  }
`
class EmbeddedGrantList extends LitElement {

  static get properties() {
    return {
      grants: { type: Array },
      person_url: { type: String},
    }
  }

  constructor() {
    super();
    this.grants = [];
  }

  connectedCallback() {
    super.connectedCallback();
    let person_url = this.getAttribute("person-url");
    let regex = /[n]\d+/g;
    let person_id = (person_url.match(regex)).toString();
    const data = client.query({
      query: GRANT_QUERY,
      variables: {
        //here get attribute person_url then strip all but the last bit for the id
        id: person_id
      }
    }).then(({data}) =>  {
      this.grants = data.person.researcherOn
    });
  }

  awardedByTemplate(awardedBy){
    if (awardedBy){
      return html `
        <span slot="awardedBy"> awarded by  ${awardedBy.label}</span>
      `
    }
  }


  grantTemplate(p) {
    let startDate = new Date(p.startDate);
    startDate = startDate.getFullYear();
    let endDate = new Date(p.endDate);
    endDate = endDate.getFullYear();
    return html`
      <vivo-grant url="/entities/grant/${p.id}" start-date="${p.title}" title="<%= p["label"] %>">
      <a slot="label" href="/entities/grant/${p.id}">
       ${p.label}
      </a>
       ${this.awardedByTemplate(p.awardedBy)}
       <span slot="date"><vivo-interval interval-start=${startDate} interval-end="${endDate}"</vivo-interval></span>
     </vivo-grant>
    `
  }




  render() {
    let grantElements = this.grants.map((p) => this.grantTemplate(p));
    return html`
      <vivo-sortable-list>
        ${grantElements}
      </vivo-sortable-list>
    `
  }
}
  customElements.define('vivo-embedded-grant-list', EmbeddedGrantList)
