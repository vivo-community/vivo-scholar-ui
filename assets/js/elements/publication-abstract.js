import { LitElement, html, css } from "lit-element";

class PublicationAbstract extends LitElement {
  static get properties() {
    return {
      maxLength: { attribute: "max-length", type: Number },
      fullText: { type: String },
      truncatedText: { type: String }
    };
  }

  constructor() {
    super();
    this.fullText = "";
    this.truncatedText = "this should be the truncated text";
    this.maxLength = 5; // low just to make it obvious
  }

  firstUpdated(props) {
    var shadow = this.shadowRoot
    const slot = shadow.getElementById("pub-abstract");
    if (slot.assignedNodes().length > 0) {
        // NOTE: this assumes it is ALL text (e.g. no elements)
        // abstract can have html in them though ...
        this.fullText = slot.assignedNodes()[0].textContent;
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      ${this.fullText.length > this.maxLength
      ? html`
        <slot id="pub-abstract">${this.truncatedText} <span>... (More)</span></slot>
        ` 
        : 
        html`
        <slot id="pub-abstract">${this.fullText}</slot>
        `
      }
    `;
  }
}

customElements.define("vivo-publication-abstract", PublicationAbstract);
/*
TODO: 
1. if text? in slot more than max-length characters - or slot takes up
   some amount of height/width ???
 
   width.value = slot.offsetWidth
   height.value = slot.offsetHeight

2. hide with ... and a (More) button link
3. click button to show rest (toggle? or not)

e.g.
html`<span>...</span><a @click="${this.clickHandler}">(More)</a>`

*/