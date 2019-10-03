import { LitElement, html, css } from "lit-element";

class SiteSearchBox extends LitElement {

  static get properties() {
    return {
      action: { type: String },
      query: { type: String },
      externalSubmit: { attribute: 'external-submit', type: Boolean }
    }
  }

  constructor() {
    super();
    this.query = "";
    this.externalSubmit = false;
  }

  static get styles() {
    return css`
      :host {
        margin: 0;
        width: 100%;
      }
      form {
        border: 1px solid var(--highlightColor);
        display: flex;
        flex-flow: row-nowrap;
      }
      input[name="search"] {
        flex: 1;
        padding: 1em;
        font-size: 1.2em;
      }
      button[type="submit"] {
        cursor: pointer;
        padding: 1em;
        border: none;
        color: white;
        background-color: var(--highlightColor);
        font-size: 1.2em;
        font-weight: bold;
      }
    `
  }

  handleSubmit(e) {
    let query = this.shadowRoot.querySelector('input[name="search"]').value;
    this.dispatchEvent(new CustomEvent('searchSubmitted', { detail: query }));
    if (this.externalSubmit) {
      e.preventDefault();
    }
  }

  render() {
    return html`
      <form method="GET" action="${this.action}" @submit="${this.handleSubmit}">
        <input name="search" id="search" type="text" placeholder="Search" value="${this.query}"/>
        <button type="submit">Search</button>
      </form>
    `
  }

}

customElements.define('vivo-site-search-box', SiteSearchBox);
