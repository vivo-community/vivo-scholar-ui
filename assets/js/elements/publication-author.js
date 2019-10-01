import { LitElement, html, css } from 'lit-element';

class PublicationAuthor extends LitElement {

    static get properties() {
        return {
          profileUrl: { attribute: 'profile-url', type: String }
        }
    }

    static get styles() {
        return css`
         :host {
            display: inline;
          }
        `
    }

    render() {
      if (this.profileUrl) {
        return html`
          <a href="${this.profileUrl}">
            <slot></slot>
          </a>
       `
      } else {
        return html`
          <slot></slot>
        `
      }
    }
}

customElements.define('vivo-publication-author', PublicationAuthor)
