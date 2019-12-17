import { LitElement, html, css } from "lit-element";

import EventBus from "../lib/event-bus.js";

class SiteSearchBox extends LitElement {

  static get properties() {
    return {
      action: { type: String },
      query: { type: String },
      label: { type: String },
      placeholder: { type: String },
      externalSubmit: { attribute: 'external-submit', type: Boolean }
    }
  }

  constructor() {
    super();
    // initiate value from query string?
    this.query = "";
    this.label = "Search"; //default
    this.placeholder = "Search";
    this.externalSubmit = false;
  }

  static get styles() {
    return css`
      :host {
        margin: 0;
        width: 100%;
      }
      #search-box {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }
      form {
        display: flex;
        width: 100%;
        border: 1px solid var(--highlightColor);
      }
      input[name="search"] {
        flex: 1;
        padding: 1em;
        font-size: 1em;
        border: none;
      }
      input[name="search"]:placeholder-shown {
        text-overflow: ellipsis;
      }
      button[type="submit"] {
        cursor: pointer;
        padding: 1em;
        border: none;
        color: white;
        background-color: var(--highlightColor);
        font-size: 1em;
        font-weight: bold;
      }
      ::slotted([slot="after"]) {
        flex: 1;
        margin-left: 0.5em;
      }
      @media (max-width: 500px) {
        #search-box {
          flex-flow: column;
        }
        ::slotted([slot="after"]) {
          margin-left: 0;
          margin-top: .75em;
        }
        input[name="search"], button[type="submit"] {
          font-size: 0.8em;
        }
      }
    `
  }

  handleSubmit(e) {
    let query = this.shadowRoot.querySelector('input[name="search"]').value;    
    let event = new CustomEvent('searchSubmitted', {
      detail: query.trim(),
      bubbles: true,
      cancelable: false,
      composed: true 
    })
    
    this.dispatchEvent(event);

    //EventBus.fire(event);
    //window.dispatchEvent(event);

    if (this.externalSubmit) {
      e.preventDefault();
    }
  }

  render() {
    return html`
      <div id="search-box">
        <form method="GET" action="${this.action}" @submit="${this.handleSubmit}">
          <input name="search" id="search" type="text" placeholder="${this.placeholder}" value="${this.query}"/>
          <button type="submit">
            ${this.label}
          </button>
        </form>
        <slot name="after"></slot>
      </div>
    `
  }

}

customElements.define('vivo-site-search-box', SiteSearchBox);
