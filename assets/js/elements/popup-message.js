

import { LitElement, html, css } from "lit-element";


class PopupMessage extends LitElement {

  static get properties() {
    return {
      open: { attribute: "open", type: Boolean, reflect: true },
      placeholder: { type: String }
    };
  }

  constructor() {
      super();
      this.open = false;
      this.classes = { "modal": true, "show-modal": false }
  }

  firstUpdated() {
    this._slot = this.shadowRoot.querySelector("slot");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  openUp() {
    this.open = true;
  }

  closeDown() {
    this.open = false;
  }



  static get styles() {
    return css`
    :host {
      display: none;
      --scrollbarBG: #d3dbe5;
      --thumbBG: #2F3D4F;
    }
    :host([open]){
      display: flex;
    }
    vivo-message-modal {
      --modal-width: 25rem;
    }
    .fas {
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      font-size: 1em;
      -webkit-font-smoothing: antialiased;
      flex-basis: 15%;
    }
    :host([open]) .fa-times::before {
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      content: "\\f00d";
      padding: 4px;
      font-size: 1.5em;
      padding-right: 1em;
      padding-top: 6px;
    }
    ::slotted(a) {
      text-decoration: none;
      display: block;
      text-align: center;
      color: white;
      font-weight: bold;
      margin-top: 1em;
      margin-right: 12em;
      padding: .5em 1em .5em 1em;
      background-color: var(--highlightColor);
    }
    ::slotted([slot="title"]) {
      flex-grow: 1;
      flex-basis: 30%;
      text-align: left;
      font-weight: bold;
      font-size: .99em;
      padding-left: 12px;
      padding-top: 4px;
    }
    .heading {
      background-color: var(--highlightBackgroundColor);
      margin-top: 0;
      display:flex;
      padding-right: 4px;
      padding-left: 1em;
      padding-top: 1em;
      padding-bottom: 1em;
    }
    .smaller-input {
      font-size: 0.85em;
      width: 65%;
    }
    .message-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-height: 250px;
      min-height: 175px;
      min-width: 100px;
      max-width: 32rem;
      overflow-x: scroll;
      overflow-y: hidden;
      margin: 1em;
      margin-right: 2em;
      margin-left: 2em;
      padding-left: 4px;
      padding-bottom: 1.2em;
      padding-top: 1.2em;
      scrollbar-base-color:#ffeaff;
      scrollbar-width: thin;
      scrollbar-color: var(--thumbBG) var(--scrollbarBG);
      font-size: 0.90em;
    }
    .message-container::-webkit-scrollbar {
      background-color: white;
      border-radius: 10px;
      width: 20px;
    }
    .message-container::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 10px;
      border: 5px solid white;
    }
    .hide-scrollbar::-webkit-scrollbar-thumb:horizontal{
      height: 20px !important;
      width: 20px !important;
    }
    @media screen and (max-width: 1000px) {
       :host([open]) .fa-times::before {
        padding-right: unset;
      }
      ::slotted(a) {
        margin-top: 1em;
        margin-right: 0;
        padding: .5em 1em .5em 1em;
      }
      .message-container {
        display: block;
        overflow: auto;
        overflow-x: hidden;
        scrollbar-base-color:#ffeaff;
        min-height: unset;
        max-height: 60%;
        font-size: unset;
      }
    }
    `;
  }


  render() {
    return html`
    <vivo-message-modal ?shown="${this.open}">
        <div class="heading">
          <slot name="title"></slot>
          <i class="fas fa-times" @click=${this.closeDown}></i>
        </div>
        <div class="message-container">
          <slot name="content"></slot><br><br>
          <slot name="link"></slot>
        </div>
    </vivo-message-modal>
    `;
  }
}

customElements.define("vivo-popup-message", PopupMessage);
