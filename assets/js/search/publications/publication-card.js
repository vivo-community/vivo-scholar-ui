import { LitElement, html, css } from "lit-element";

class PublicationCard extends LitElement {

    static get properties() {
        return {
          publication: { type: Object }
        }
      }

    constructor() {
      super();
    }
  
    renderPublisher(publisher) {
        if (publisher) {
            return html`
              <span slot="publisher">${publisher.label}</span>
            `
        }
    }

    renderAbstract(abstract) {
        if (abstract) {
            return html`
            <vivo-truncated-text slot="abstract">${abstract}</vivo-truncated-text>
            `
        }
    }

    renderAuthor(author) {
      return html`
      <vivo-publication-author profile-url="/entities/person/${author.id}">
        ${author.label}
      </vivo-publication-author>
    `
    }

    renderAuthors(authors) {
      if (authors) {
        return html`<vivo-publication-author-list slot="authors">
          ${authors.map((a) => this.renderAuthor(a))}
        </vivo-publication-author-list>
        `
      }
    }

    renderPublication(p) {
      let pubDate = new Date(p.publicationDate);
      let dateFormatted = pubDate.toLocaleDateString("en-US");

      return html`
        <vivo-publication publication-url="/entities/publication/${p.id}" 
          link-decorate="${this.linkDecorate}"
          published-date="${p.publicationDate}">
          <div slot="title">${p.title}</div>
          ${this.renderAuthors(p.authors)}
          ${this.renderPublisher(p.publisher)}
          <span slot="date">${dateFormatted}</span>
          ${this.renderAbstract(p.abstractText)}
        </vivo-publication>
        `;
    }

    render() {
      if (!this.publication) {
        return html``
      } else {
        return html`${this.renderPublication(this.publication)}`
      }
    }
  }
  
  customElements.define('vivo-publication-card', PublicationCard);
  