import { LitElement, html, css } from "lit-element";

class GrantCard extends LitElement {

    constructor() {
      super();
    }
  
    static get styles() {
      return css`
      h2 {
        color: var(--primaryColor);
        font-weight: bold;
        font-size: 1.1em;
        margin-top: 1em;
        margin-top: 0;
        margin-bottom: .3em;
        line-height: 1.1em;
      }
      ::slotted(a) {
        color: var(--linkColor);
        text-decoration: none;
      }
      :host {
          display: block;
          margin-bottom: 1.5em;
      }
      
    `
  }

    render() {
      return html`
          <h2>          
            <slot name="title" />
          </h2>
          <slot name="contributors"></slot>
          <slot name="awardedBy"></slot>
          <slot name="admin"></slot>
          <slot name="date"></slot>
          <slot />
          `
    }
  }
  
  customElements.define('vivo-grant-card', GrantCard);
  