import './web-components/publication'
import './web-components/publication-list'
import gql from 'graphql-tag'
import client from './lib/apollo'

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
        pub.setAttribute('title',p.title);
        return pub;
      })
      let publicationList = document.createElement('vivo-publication-list');
      publicationElements.forEach(p => publicationList.appendChild(p));
      this.shadowRoot.appendChild(publicationList);
    });
  }

}

customElements.define('vivo-embedded-publication-list', EmbeddedPublicationList)
