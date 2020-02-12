import { LitElement, html, css } from "lit-element";

class PersonCard extends LitElement {

    constructor() {
      super();
    }
  
    render() {
      return html`
          <h2>          
            <slot name="name" />
          </h2>
          <h3>
            <slot name="title" />
          </h3>
          <slot />
          `
    }
  }
  
  customElements.define('vivo-person-card', PersonCard);
  