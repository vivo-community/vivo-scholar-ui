import { LitElement, html, css } from "lit-element";

class TruncatedText extends LitElement {

    static get properties() {
      return {
        truncateRequired: { attribute: 'truncate-required', type: Boolean, reflect: true }
      }
    }

    constructor() {
      super();
      this.truncateRequired = true;
    }

    static get styles() {
      return css`
        slot {
          display: block;
          position: relative;
          box-sizing: border-box;
          --max-lines: 2;
          --lh: 1.6rem;
          line-height: var(--lh);
          max-height: calc(var(--lh) * var(--max-lines));
          overflow: hidden;
          padding-right: 1rem;
        }
        ::slotted(*:first-child) {
          margin-top: 0;
          padding-top: 0;
        }
        ::slotted(*:last-child) {
          margin-bottom: 0;
          padding-bottom: 0;
        }
        :host([expanded]) slot {
          max-height: initial;
        }
        slot::before {
          display: none;
        }
        :host([truncate-required]) slot::before {
          display: block;
          content: '...';
          position: absolute;
          bottom: 0;
          right: 0;
        }
        a.show {
          display: none;
          color: var(--linkColor);
          cursor: pointer;
        }
        :host([truncate-required]) a.show.more {
          display: inline-block;
        }
        :host([expanded]) a.show.less {
          display: inline-block;
        }
        :host([expanded]) a.show.more {
          display: none;
        }
      `
    }

    expand() {
      this.setAttribute('expanded', true);
    }

    collapse() {
      this.removeAttribute('expanded');
    }

    firstUpdated() {
      const slot = this.shadowRoot.querySelector('slot');
      this.initialHeight = slot.offsetHeight;
      this.observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target.scrollHeight > Math.round(entry.contentRect.height)) {
            this.truncateRequired = true;
          } else {
            this.truncateRequired = false;
          }
          if (entry.target.scrollHeight <= this.initialHeight) {
            this.collapse();
          }
        }
      });
      this.observer.observe(slot);
    }

    disconnectedCallBack() {
      super.disconnectedCallBack();
      if (this.observer) {
        this.observer.disconnect();
      }
    }

    render() {
      return html`
        <slot></slot>
        <a class="show more" @click="${this.expand}">(More)</a>
        <a class="show less" @click="${this.collapse}">(Less)</a>
      `
    }

}

customElements.define("vivo-truncated-text", TruncatedText);
