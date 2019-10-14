import { LitElement, html, css } from 'lit-element';

class TabPanel extends LitElement {

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
      <slot/>
    `
  }

}

customElements.define('vivo-tab-panel', TabPanel);
