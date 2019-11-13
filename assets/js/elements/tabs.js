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
      tab.setAttribute('selected', 'selected');
      let index = Array.from(tabs).indexOf(tab);
      let panels = this.querySelectorAll('vivo-tab-panel');
      panels.forEach((t) => t.removeAttribute('selected'));
      panels[index].setAttribute('selected', 'selected');
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
      }  
      ::slotted(vivo-tab) {
        order: 1;
        display: block;
        cursor: pointer;
        padding: 1rem 2rem;
      }
      ::slotted(vivo-tab[selected]) {
        background-color: var(--highlightBackgroundColor);
      }
      ::slotted(vivo-tab:hover) {
        background-color: var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="secondary"]) ::slotted(vivo-tab) {
        color: var(--darkNeutralColor);
        background-color: transparent;
      }
      :host([vivo-tab-style="secondary"]) ::slotted(vivo-tab:hover) {
        color: var(--textColor);
        border-bottom: 1px solid var(--textColor);
      }
      :host([vivo-tab-style="secondary"]) ::slotted(vivo-tab[selected]) {
        color: var(--textColor);
        border-bottom: 1px solid var(--textColor);
      }

      ::slotted(vivo-tab-panel) {
        display: none;
      }
      ::slotted(vivo-tab-panel[selected]) {
        display: block;
      }

      ::slotted(vivo-tab-panel) {
        order: 99;
        flex-grow: 1;
        width: 100%;
        display: none;
        padding: 1rem;
        background: #fafafa;
        border-top: 10px solid var(--highlightBackgroundColor);
      }
      :host([vivo-tab-style="secondary"]) ::slotted(vivo-tab-panel) {
        border-top: 1px solid var(--mediumNeutralColor);
      }
      @media (max-width: 45em) {
        ::slotted(vivo-tab2) {
          order: initial;
        }
        ::slotted(vivo-tab) {
          width: 100%;
          margin-right: 0;
          margin-top: 0.2rem;
          background-color: var(--highlightBackgroundColor);
        }
        :host([vivo-tab-style="secondary"]) ::slotted(vivo-tab) {
          color: var(--textColor);
          border-bottom: 1px solid var(--textColor);
        }
        ::slotted(vivo-tab-panel), ::slotted(vivo-tab) {
            order: initial;
        }
        ::slotted(vivo-tab-panel) {
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
        <slot @click="${this.selectTab}"/>
    `
  }
}

customElements.define('vivo-tabs', Tabs);
