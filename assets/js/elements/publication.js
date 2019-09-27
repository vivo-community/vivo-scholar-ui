import { LitElement, html, css } from 'lit-element';

class Publication extends LitElement {

  static get properties() {
    return {
      id: { type: Number },
      authors: { type: Array },
    }
  }

  constructor() {
    super();
    this.authors = [];
  }

  render() {
    let authorList = this.authors.map(a => a.label ).join(";")
    return html`
      <style>
        :host {
          display: block;
          padding: 4px;
        }
        :host([link-decorate=true]) .title a {
          text-decoration: underline;
        }
        .title {
          font-size: var(--publication-title-font-size, 19px);
          font-weight: bold;
          color: var(--publication-title-color, #2f3d4f);
          margin-bottom: 8px;
        }
        .title a {
          color: var(--publication-title-link-color, #007bff);
          text-decoration: none;
          background-color: transparent;
        }
        .abstract {
          padding: 0.5em;
          font-size: var(--publication-abstract-font-size, inherit);
        }
        .pub-authors {
          font-weight: var(--publication-authors-font-weight, bold);
          font-size: var(--publication-authors-font-size, inherit);
        }
        .pub-date {
          font-style: var(--publication-date-font-style, italic);
          font-size: var(--publication-date-font-size, inherit);
        }
      </style>
      <div class="title">
          <a href="/entities/publication/${this.id}">
           <slot name="title"/>
          </a>
       </div>
       <div>
         <span class="pub-authors">
         ${authorList}
         </span>
         <span class="pub-date">
           <slot name="date"/>
         </span>
       </div>
       <div class="abstract">
         <slot name="abstract"/>
       </div>
    `;
  }
}

customElements.define('vivo-publication', Publication)
