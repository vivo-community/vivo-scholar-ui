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
      order: 99;
      flex-grow: 1;
      width: 100%;
      display: none;
      padding: 0;
      border-top: 10px solid var(--highlightBackgroundColor);
    }
    :host([selected]) {
      display: block;
    }

    :host([vivo-tab-style="secondary"]) {
      border-top: none;
    }
    :host([vivo-tab-style="combo"]) {
      border-top: none;
    }
    @media (max-width: 45em) {
      :host {
        order: initial;
      }
      :host {
        width: 100%;
        margin-right: 0;
        margin-top: 0.2rem;
        border-top: 0px;
      }
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
