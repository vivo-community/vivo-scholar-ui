import { LitElement, html, css } from "lit-element";

class SiteSubHeader extends LitElement {

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row nowrap;
        margin: 0;
        width: 100%;
        background-color: var(--lightNeutralColor);
        color: var(--textColor);
        height: 100px;
        align-items: center;
      }
    
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }

}

customElements.define('vivo-site-sub-header', SiteSubHeader);
