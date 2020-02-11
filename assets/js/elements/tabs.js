import { LitElement, html, css } from 'lit-element';

class Tabs extends LitElement {

  static get properties() {
    return {
      vivoTabStyle: { attribute: 'vivo-tab-style', type: String, reflect: true }
    }
  }

  constructor() {
    super();
    this.tabs = [];
    this.panels = [];
    this._onSlotChange = this._onSlotChange.bind(this);
    this.vivoTabStyle = "primary";
  }

  firstUpdated() {
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener('slotchange', this._onSlotChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._slot.removeEventListener('slotchange', this._onSlotChange);
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
        tab.vivoTabStyle = this.vivoTabStyle;
        panel.setAttribute('aria-labelledby', tab.id);
        panel.vivoTabStyle = this.vivoTabStyle;
      }
    });
    const screenWidth = window.screen.width;
    if (screenWidth > 720) {
      if (this.tabs.length >= 1 && this.panels.length >= 1 && this.tabs.filter((t) => t.selected).length == 0) {
        this.selectTab(this.tabs[0]);
      }
    }
   }

  selectTabById(tabId) {
    this.selectTab(this.querySelector(`vivo-tab#${tabId}`));
  }

  selectTab(tab) {
    const screenWidth = window.screen.width;
    let tabs = this.querySelectorAll('vivo-tab');
    let index = Array.from(tabs).indexOf(tab);
    let panels = this.querySelectorAll('vivo-tab-panel');
    if (screenWidth < 720 && tab.hasAttribute('selected')){
      tab.removeAttribute('selected');
        panels[index].removeAttribute('selected');
    } else {
    if (tab) {
      tabs.forEach((t) => t.removeAttribute('selected'));
      tab.setAttribute('selected', 'selected');
      panels.forEach((t) => t.removeAttribute('selected'));
      panels[index].setAttribute('selected', 'selected');
    }
      this.dispatchEvent(new CustomEvent('tabSelected', {
        detail: tab,
        bubbles: true,
        cancelable: false,
        composed: true
      }));

   }
  }

  handleSelectTab(e) {
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
    this.selectTab(tab);
  }


  static get styles() {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
      }
    `
  }

  render() {
    return html`
        <slot @click="${this.handleSelectTab}"/>
    `
  }
}

customElements.define('vivo-tabs', Tabs);
