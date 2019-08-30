import './web-components/publication'
import './web-components/publication-list'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

let endpoint = "https://scholars-discovery-scholars.cloud.duke.edu/graphql"
//let endpoint = "http://localhost:9000/graphql"

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
      selectedPublications {
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

class EmbeddedPublicationList extends HTMLElement {

  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    const data = client.query({
      query: PUBLICATION_QUERY,
      variables: {
        id: this.getAttribute("person_id")
      }
    }).then(({data}) =>  {
      let publications = data.person.selectedPublications
      let publicationElements = publications.map(p => {
        let pub = document.createElement('vivo-publication');
        pub.setAttribute('id',p.id);
        pub.innerHTML = `
          <div slot="title">${p.title}</div>
          <div slot="abstract">${p.abstractText}</div>
        `
        return pub;
      })
      let publicationList = document.createElement('vivo-publication-list');
      publicationElements.forEach(p => publicationList.appendChild(p));
      this.shadowRoot.appendChild(publicationList);
    });
  }

}

customElements.define('vivo-embedded-publication-list', EmbeddedPublicationList)
