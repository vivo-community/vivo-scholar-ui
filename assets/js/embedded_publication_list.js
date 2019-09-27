import './web-components/publication'
import './web-components/publication-list'
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
        let pubDate = new Date(p.publicationDate)
        // TODO: would probably want to get locale from something
        let dateFormatted = pubDate.toLocaleDateString("en-US")
        let pub = document.createElement('vivo-publication')
        pub.setAttribute("link-decorate", 
        this.getAttribute("link-decorate") || false)
        pub.setAttribute('id',p.id)
        // TODO: not crazy about this
        pub.setAttribute("authors", JSON.stringify(p.authors))

        //let authorList = p.authors.map(a => a.label).join(",")
        // authors might need to be attribute too
        // since it's an array
        pub.innerHTML = `
          <div slot="title">${p.title}</div>
          <span slot="date">${dateFormatted}</span>
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
