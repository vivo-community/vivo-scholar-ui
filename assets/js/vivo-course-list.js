import { LitElement, html, css } from 'lit-element';

import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

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
      person_url: { type: String},
      endpoint: { type: String }
    }
  }

  constructor() {
    super();
    this.courses = [];
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
      query: COURSE_QUERY,
      variables: {
        id: person_id
      }
    }).then(({data}) =>  {
      this.courses = data.person.teachingActivities
    });
  }

  courseTemplate(p) {
    return html`
      <vivo-course>
           <span slot="course-title">${p.label}</span>
          <span slot="course-role">${p.role}</span>
     </vivo-course>
    `
  }


  render() {
    let courseElements = this.courses.map((p) => this.courseTemplate(p));
    return html`
        ${courseElements}
    `
  }
}
  customElements.define('vivo-embedded-course-list', EmbeddedCourseList)
