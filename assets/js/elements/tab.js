import { LitElement, html, css } from 'lit-element';

class Tab extends LitElement {

  static get properties() {
    return {
      vivoTabStyle: { attribute: 'vivo-tab-style', type: String, reflect: true },
      selected: { type: Boolean }
    }
  }

  static get styles() {
    return css`
      :host {
        order: 1;
        display: block;
        cursor: pointer;
        padding: 1rem;
      }
      :host([selected]) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="primary"]:hover) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="secondary"]) {
        color: var(--textColor);
        background-color: transparent;
        padding: .5rem 3rem;
        opacity: 25%;
      }
      :host([vivo-tab-style="secondary"]:hover) {
        color: var(--textColor);
        border-bottom: 3px solid var(--textColor);
      }
      :host([vivo-tab-style="secondary"][selected]) {
        color: var(--textColor);
        border-bottom: 3px solid var(--textColor);
        opacity: 100%;
      }

      :host([vivo-tab-style="combo"]) {
        color: var(--textColor);
        background-color: transparent;
        padding: .5rem 3rem;
        opacity: 25%;
      }
      :host([vivo-tab-style="combo"]:hover) {
        color: var(--textColor);
        border-bottom: 3px solid var(--textColor);
      }
      :host([vivo-tab-style="combo"][selected]) {
        color: var(--textColor);
        border-bottom: 3px solid var(--textColor);
        opacity: 100%;
      }


      .fas { display: none; }
      @media (max-width: 45em) {
        .fas {
          display: inline-block;
          font-style: normal;
          font-variant: normal;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
        }
        .fa-chevron-down::before {
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
          content: "\\f078";
        }
        :host([selected]) .fa-chevron-down::before {
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
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

      @media screen and (max-width: 1000px) {
        :host([vivo-tab-style="combo"]) {
          width: 85%;
          color: var(--textColor);
          padding-top:0;
          padding-left: 0;
          border-top: none;
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
