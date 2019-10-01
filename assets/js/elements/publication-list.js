import { LitElement, html, css } from 'lit-element';

class PublicationList extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }
      ::slotted(vivo-publication) {
        margin-bottom: 1em;
      }
      ::slotted(vivo-publication) {
        font-size: var(--publication-font-size, 18px);
        border: 1px solid lightgray;
      }
    `
  }

  render() {
    return html`
      <slot />
    `;
  }

}

customElements.define('vivo-publication-list', PublicationList);
