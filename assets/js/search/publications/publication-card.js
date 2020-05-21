import { LitElement, html, css } from "lit-element";

class PublicationCard extends LitElement {

    static get properties() {
        return {
          publication: { type: Object }
        }
      }

    constructor() {
      super();
      this.handlePubClicked = this.handlePubClicked.bind(this);
    }

    firstUpdated() {
        document.addEventListener('publicationClicked', this.handlePubClicked);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('publicationClicked', this.handlePubClicked);
    }
  
    handlePubClicked(e) {
        let pubUrl = e.detail.getAttribute("publication-url");
        window.location = pubUrl;
    }

    renderPublisher(publisher) {
        if (publisher) {
            return html`
              <span slot="publisher">${publisher.label}</span>
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
          <vivo-search-truncated-text-result slot="abstract" text="${p.abstractText}">
          </vivo-search-truncated-text-result>
        </vivo-publication>
        `;
    }

    static get styles() {
        return css`
        div[slot=title]:hover {
            cursor: pointer;
        }
        div[slot="title"] {
          margin-bottom: 0.0em;
          font-size: 1.1em;
          line-height: 1.1em;
        }
        [slot="authors"], [slot="publisher"] {
          padding-top: 0.0em;
        }
        `
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
  