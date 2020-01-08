import { LitElement, html, css } from "lit-element";

class PublicationAuthor extends LitElement {

  static get properties() {
    return {
      profileUrl: { attribute: "profile-url", type: String }
    };
  }

  handleAuthorClick(e) {
    this.dispatchEvent(new CustomEvent('authorClicked', {
      detail: this,
      bubbles: true,
      cancelable: false,
      composed: true
    }));
  }

  static get styles() {
    return css`
      :host {
        display: inline;
      }
      ::slotted(*) {
        color: var(--darkNeutralColor);
        text-decoration: none;
        white-space: nowrap;
      }
      slot {
        display: inline;
      }
    `;
  }

  render() {
    return html`
      <slot @click="${this.handleAuthorClick}"></slot>
    `
  }
}

customElements.define("vivo-publication-author", PublicationAuthor);
