import { LitElement, html, css } from 'lit-element';
import './elements/grant';
import './elements/interval';

let check = customElements.get('vivo-sortable-list');

// NOTE: if only using this component, need this imported
(async () => {
    if (!check) {
      await import('./elements/sortable-list');
    }
})();

import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

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
      person_id: { type: String},
      i18n: { type: Object },
      endpoint: { type: String }
    }
  }

  constructor() {
    super();
    this.grants = [];
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
      query: GRANT_QUERY,
      variables: {
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
      <vivo-grant url="/entities/grant/${p.id}" start-date="${startDate}" title=${p.label}>
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
    let oldestFirstLabel = this.i18n['oldest_first'] ? this.i18n['oldest_first'] : 'Oldest First';
    let newestFirstLabel = this.i18n['newest_first'] ? this.i18n['newest_first'] : 'Newest First';
    let grantAtoZLabel = this.i18n['grant_a_z'] ? this.i18n['grant_a_z'] : 'Grant a-z';
    let grantZtoALabel = this.i18n['grant_z_a'] ? this.i18n['grant_z_a'] : 'Grant z-a';
    let showingLabel = this.i18n['showing'] ? this.i18n['showing'] : 'Showing';
    let ofLabel = this.i18n['of'] ? this.i18n['of'] : 'of';
    let showingAllLabel = this.i18n['showing_all'] ? this.i18n['showing_all'] : 'Showing All';

    return html`
      <vivo-sortable-list item-type="grants" sortProperty="startDate" sortDirection="desc" .sorts="${this.sorts}">
      <vivo-sort-option field="startDate" direction="asc" label="${oldestFirstLabel}"></vivo-sort-option>
      <vivo-sort-option field="startDate" direction="desc" label="${newestFirstLabel}"></vivo-sort-option>
      <vivo-sort-option field="title" direction="asc" label="${grantAtoZLabel}"></vivo-sort-option>
      <vivo-sort-option field="title" direction="desc" label="${grantZtoALabel}"></vivo-sort-option>

      ${grantElements}

      <vivo-i18n-label key="showing" label="${showingLabel}"></vivo-i18n-label>
      <vivo-i18n-label key="of" label="${ofLabel}"></vivo-i18n-label>
      <vivo-i18n-label key="showing_all" label="${showingAllLabel}"></vivo-i18n-label>

      </vivo-sortable-list>
    `
  }
}
  customElements.define('vivo-embedded-grant-list', EmbeddedGrantList)
