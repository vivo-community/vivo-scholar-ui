import { LitElement, html, css } from 'lit-element';

class TabPanel extends LitElement {

  render() {
    return html`
        <slot></slot>
    `
  }

}

customElements.define('vivo-tab-panel', TabPanel);