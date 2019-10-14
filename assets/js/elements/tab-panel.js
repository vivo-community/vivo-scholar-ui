import { LitElement, html, css } from 'lit-element';

class TabPanel extends LitElement {

  static get properties() {
    return {
      vivoTabStyle: { attribute: 'vivo-tab-style', type: String, reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }

}

customElements.define('vivo-tab-panel', TabPanel);
