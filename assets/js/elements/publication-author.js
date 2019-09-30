import { LitElement, html, css } from 'lit-element';

class PublicationAuthor extends LitElement {

    static get properties() {
        return {
          authorId: { attribute: 'author-id', type: String, reflect: true },
          authorName: { attribute: 'author-name', type: String, reflect: true }
        }
    }
    
    constructor() {
      super();
    }

    static get styles() {
        return css`
          li {
            display: inline;
          }
          li::after {
            content: "; ";
          }
          li:last-child::after {
              content: "";
          }`
    }

    render() {
        return html`
        <li>
          <a href="/entities/people/${this.authorId}">
          ${this.authorName}
          </a>
        </li>`;
    }
}

customElements.define('vivo-publication-author', PublicationAuthor)