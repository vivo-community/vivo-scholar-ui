import { LitElement, html, css } from "lit-element";

class PersonCard extends LitElement {

    constructor() {
      super();
    }
  
    static get styles() {
      return css`
      h2 {
        color: var(--primaryColor);
        font-weight: bold;
        font-size: 1.1em;
        margin-top: 0.75em;
        margin-bottom: .3em
      }
      ::slotted(a) {
        color: var(--linkColor);
        text-decoration: none;
      }
      h3 {
        color: var(--textColor);
        font-weight: bold;
        font-size: 0.9em;
        margin-top: 0;
        margin-bottom: .5em;
      }
      :host {
          display: block;
      }
      @media screen and (max-width: 1000px) {
        ::slotted(#overview) {
           display: none;
         }
      }
      
    `
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
  