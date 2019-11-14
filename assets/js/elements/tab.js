import { LitElement, html, css } from 'lit-element';

class Tab extends LitElement {
        
  static get properties() {
    return {
      vivoTabStyle: { attribute: 'vivo-tab-style', type: String, reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
        order: 1;
        display: block;
        cursor: pointer;
        padding: 1rem 2rem;
      }
      :host([selected]) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="primary"]:hover) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="secondary"]) {
        color: var(--darkNeutralColor);
        background-color: transparent;
      }
      :host([vivo-tab-style="secondary"]:hover) {
        color: var(--textColor);
        border-bottom: 1px solid var(--textColor);
      }
      :host([vivo-tab-style="secondary"][selected]) {
        color: var(--textColor);
        border-bottom: 1px solid var(--textColor);
      }


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

        :host {
          order: initial;
        }
        :host([selected]) {
          background-color: transparent;
        }
        :host {
          width: 100%;
          margin-right: 0;
          margin-top: 0.2rem;
          border-bottom: 1px solid var(--highlightBackgroundColor);
        }
        :host([vivo-tab-style="secondary"]) {
          color: var(--textColor);
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
