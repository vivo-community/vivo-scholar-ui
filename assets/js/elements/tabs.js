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
    // this._onKeyDown = this._onKeyDown.bind(this)
    this.vivoTabStyle = "primary";
    const KEYCODE = {
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39,
      UP: 38,
      HOME: 36,
      END: 35,
    };
  }

  firstUpdated() {
    this._slot = this.shadowRoot.querySelector("slot");
    this._slot.addEventListener('slotchange', this._onSlotChange);
  }

  // connectedCallBack() {
  //   this._slot.addEventListener('keydown', this._onKeyDown);
  //   }

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
    if (this.tabs.length >= 1 && this.panels.length >= 1 && this.tabs.filter((t) => t.selected).length == 0) {
      this.selectTab(this.tabs[0]);
    }
  }

  selectTabById(tabId) {
    this.selectTab(this.querySelector(`vivo-tab#${tabId}`));
  }

  selectTab(tab) {
    if (tab) {
      let tabs = this.querySelectorAll('vivo-tab');
      tabs.forEach((t) => t.removeAttribute('selected'));
      tab.setAttribute('selected', 'selected');
      let index = Array.from(tabs).indexOf(tab);
      let panels = this.querySelectorAll('vivo-tab-panel');
      panels.forEach((t) => t.removeAttribute('selected'));
      panels[index].setAttribute('selected', 'selected');
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

  _allTabs() {
    return Array.from(this.querySelectorAll('vivo-tab'));
  }

  _prevTab(){
    const tabs = this._allTabs();
    let newIdx = tabs.findIndex(tab => tab.selected) - 1;
    return tabs[(newIdx + tabs.length)] % tabs.length;
  }

  _firstTab() {
    const tabs = this._allTabs();
    return tabs[0];
  }

  _lastTab() {
    const tabs = this._allTabs();
    return tabs[tabs.length - 1];
  }

  _nextTab() {
    const tabs = this._allTabs();
    let newIdx = tabs.findIndex(tab => tab.selected) + 1;
    return tabs[(newIdx + tabs.length)] % tabs.length;
  }

  _onKeyDown(e) {
    let newTab;
      switch (e.keyCode) {
        case KEYCODE.LEFT:
        case KEYCODE.UP:
          newTab = this._prevTab();
          break;

        case KEYCODE.RIGHT:
        case KEYCODE.DOWN:
          newTab = this._nextTab();
          break;

        case KEYCODE.HOME:
          newTab = this._firstTab();
          break;

        case KEYCODE.END:
          newTab = this._lastTab();
          break;

        default:
          return;
      }
      event.preventDefault();
      this.selectTab(newTab);
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
