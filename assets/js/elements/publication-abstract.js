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
    this.slotChanged = this.slotChanged.bind(this);
    // doesn't seem to be called with window resize
    this.onResize = this.onResize.bind(this);
  }

  firstUpdated(props) {
    var shadow = this.shadowRoot
    const slot = shadow.getElementById("pub-abstract");
    if (slot.assignedNodes().length > 0) {
        console.log(`text=${slot.assignedNodes()[0].textContent}`);
        // NOTE: this assumes it is ALL text (e.g. no elements)
        // abstract can have html in them though ...
        this.fullText = slot.assignedNodes()[0].textContent;
    }
  }

  onResize(e) {
    console.log("publication-abstract resized");
  }

  slotChanged(e) {
    console.log("publication-abstract slot changed");
    //console.log(`slotChanged:innerHTML=${e.target.innerHTML[0]}`);
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    console.log(`truncate?=${this.fullText.length > this.maxLength}`);
    console.log(`text-length=${this.fullText.length}`)
    console.log(`max-length=${this.maxLength}`);
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
 
   width.value = textbox.offsetWidth
   height.value = textbox.offsetHeight

2. hide with ... and a (More) button link
3. click button to show rest (toggle? or not)

e.g.
html`<span>...</span><a @click="${this.clickHandler}">(More)</a>`

    ${this.truncatedPubCount > 0
        ? html`
          <div class="pub-summary">
          <span class="pubs-shown-message"
            >Showing ${this.displayedPubCount} featured publications
          </span>
          <span class="show-all-pubs" @click="${this.showAllPubs}"
            >Show all ${this.truncatedPubCount} publications ></span
          >
          </div>
        `
        : null}


*/