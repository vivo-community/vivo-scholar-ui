import { LitElement, html, css } from 'lit-element';

class PublicationAuthorList extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline;
        margin: 0; 
        padding: 0; 
        font-size: 13px;
      }
      ul { list-style: none; display: inline; }
      ::slotted(*) { margin: 0; }
    `
  }

  render() {
    return html`
      <ul id="author-list" class="author-list">
        <slot />
      </ul>
    `;
  }

}

customElements.define('vivo-publication-author-list', PublicationAuthorList);