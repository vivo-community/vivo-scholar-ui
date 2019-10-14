import { LitElement, html, css } from 'lit-element';

class Tabs extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }
      ::slotted(vivo-tab) {
        cursor: pointer;
        margin: 0;
        padding: 1em;
      }
      ::slotted(vivo-tab:hover) {
        background-color: var(--highlightBackgroundColor);
      }
      ::slotted(vivo-tab[selected]) {
        background-color: var(--highlightBackgroundColor);
      }
      ::slotted(vivo-tab-panel) {
        display: none;
      }
      ::slotted(vivo-tab-panel[selected]) {
        display: block;
      }
      slot[name="tabs"] {
        display: block;
        margin: 0 0 .75em 0;
        border-bottom: 10px solid var(--highlightBackgroundColor);
      }
    `
  }

  constructor() {
    super();
    this.tabs = [];
    this.panels = [];
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  firstUpdated() {
    this._tabSlot = this.shadowRoot.querySelector('slot[name="tabs"]');
    this._panelSlot = this.shadowRoot.querySelector('slot[name="panels"]');
    this._tabSlot.addEventListener('slotchange',this._onSlotChange);
    this._panelSlot.addEventListener('slotchange',this._onSlotChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._tabSlot.removeEventListener('slotchange',this._onSlotChange);
    this._panelSlot.removeEventListener('slotchange',this._onSlotChange);
  }

  _onSlotChange() {
    this._linkPanels();
  }

  _linkPanels() {
    this.tabs = Array.from(this.querySelectorAll('vivo-tab'));
    this.panels = Array.from(this.querySelectorAll('vivo-tab-panel'));
    this.tabs.forEach(tab => {
      const panel = this.panels[this.tabs.indexOf(tab)];
      if (panel) {
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
      }
    });
  }

  selectTab(e) {
    let tab = e.target;
    while (tab) {
      if (tab.matches('vivo-tab')) {
        break;
      } else if (tab.matches('body')) {
        tab = null;
        break;
      } else {
        tab = tab.parentElement;
      }
    }
    if (tab) {
      let tabs = this.querySelectorAll('vivo-tab');
      tabs.forEach((t) => t.removeAttribute('selected'));
      tab.setAttribute('selected','selected');
      let index = Array.from(tabs).indexOf(tab);
      let panels = this.querySelectorAll('vivo-tab-panel');
      panels.forEach((t) => t.removeAttribute('selected'));
      panels[index].setAttribute('selected','selected');
    }
  }

  render() {
    return html`
      <slot name="tabs" @click="${this.selectTab}"></slot>
      <slot name="panels"></slot>
    `
  }
}

customElements.define('vivo-tabs', Tabs);
