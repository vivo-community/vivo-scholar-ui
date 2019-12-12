import { LitElement, html, css } from "lit-element";

class PublicationAuthor extends LitElement {
  static get properties() {
    return {
      profileUrl: { attribute: "profile-url", type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline;
      }
      a.author {
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
    if (this.profileUrl) {
      return html`
        <a class="author" href="${this.profileUrl}">
          <slot></slot>
        </a>
      `;
    } else {
      return html`
        <slot></slot>
      `;
    }
  }
}

customElements.define("vivo-publication-author", PublicationAuthor);
