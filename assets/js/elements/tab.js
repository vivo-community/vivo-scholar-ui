import { LitElement, html, css } from 'lit-element';

class Tab extends LitElement {
        
  render() {
    return html`
      <slot></slot>
    `
  }

}

customElements.define('vivo-tab', Tab);
