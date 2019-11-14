import { LitElement, html, css } from 'lit-element';

class Tab extends LitElement {
        

  static get styles() {
    return css`
      .fas { display: none; }
      @media (max-width: 45em) {
        .fas {
          display: inline-block;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: 14px;
          font-size: inherit;
          text-rendering: auto
        }
        .fa-chevron-down::before {
          box-sizing: border-box;
          content: "\\f078";
        }
        :host([selected]) .fa-chevron-down::before {
          content: "\\f077";
        }
      }
    `
  }

  render() {
    return html`
      <i class="fas fa-chevron-down"></i>
      <slot></slot>
    `
  }

}

customElements.define('vivo-tab', Tab);
