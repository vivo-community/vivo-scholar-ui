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
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
        margin: 0;
      }
      :host([vivo-tab-style="primary"]) {
        padding: 1em;
      }
      :host([vivo-tab-style="secondary"]) {
        padding: .5em;
      }
      :host([selected][vivo-tab-style="primary"]) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="primary"]:hover) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="secondary"]) {
        background-color: transparent;
        color: var(--darkNeutralColor);
      }
      :host([selected][vivo-tab-style="secondary"]) {
        color: var(--textColor);
        border-bottom: 1px solid var(--textColor);
      }
      :host([vivo-tab-style="secondary"]:hover) {
        color: var(--textColor);
        border-bottom: 1px solid var(--textColor);
      }
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }

}

customElements.define('vivo-tab', Tab);
