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

const COURSE_QUERY = gql`
  query($id: String) {
    person(id: $id) {
      id
      teachingActivities {
         label
         role
       }
    }
  }
`
class EmbeddedCourseList extends LitElement {

  static get properties() {
    return {
      courses: { type: Array },
      person_url: { type: String}
    }
  }

  constructor() {
    super();
    this.courses = [];
  }

  connectedCallback() {
    super.connectedCallback();
    let person_url = this.getAttribute("person-url");
    let regex = /[n]\d+/g;
    let person_id = (person_url.match(regex)).toString();
    const data = client.query({
      query: COURSE_QUERY,
      variables: {
        //here get attribute person_url then strip all but the last bit for the id
        id: person_id
      }
    }).then(({data}) =>  {
      this.courses = data.person.teachingActivities
    });
  }


  courseTemplate(p) {
    return html`
      <vivo-course>
      <!-- work on this logic, probably add other template information -->
      <%= for (c) in courses { %>
           <span slot="course-title"><%= c["label"] %></span>
        <%= if (c["role"]) { %>
          <span slot="course-role"><%= c["role"] %></span>
        <% } %>
      <% } %>
     </vivo-course>
    `
  }




  render() {
    let course Elements = this.courses.map((p) => this.courseTemplate(p));
    return html`
    <p>test</p>
      <vivo-course-list>
        ${courseElements}
      </vivo-course-list>
    `
  }
}
  customElements.define('vivo-embedded-course-list', EmbeddedCourseList)
