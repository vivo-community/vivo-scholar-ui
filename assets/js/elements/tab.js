import { LitElement, html, css } from 'lit-element';

class Tab extends LitElement {

  static get styles() {
    return css`
      :host {
        display: inline-block;
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

customElements.define('vivo-tab', Tab);
