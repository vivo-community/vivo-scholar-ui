import { LitElement, html, css } from "lit-element";

class PopupMessage extends LitElement{

  static get properties() {
    return {
      open: {
        attribute: "open",
        type: Boolean,
        reflect: true
      },
    };
  }

  firstUpdated() {
    this.addEventListener("click",this.togglePopup);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.togglePopup);
  }


  static get styles() {
    return css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
      box-sizing: border-box;
      overflow: scroll;
      position: fixed;
      font-size: 1.5em;
      text-align: center;
      line-height: normal;
      height: 50%;
      width: 50%;
      transform: translate(0,-50%);
      border: 1px solid black;
      border-radius: 25px;
      background-color: var(--highlightBackgroundColor);
      padding: 1em;
    }
    :host([open]) .fas {
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      font-size: 2em;
      display: flex;
      flex-direction: row-reverse;
      -webkit-font-smoothing: antialiased;
    }
    :host([open]) .fa-times::before {
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      content: "\\f00d";
    }
    ::slotted(a) {
      text-decoration: none;
      color: black;
      font-weight: bold;
    }

  @media(max-width: 1230px) {
    :host([open]) {
      width: 55%;
    }
  }
  @media(max-width: 1100px) {
    :host([open]) {
      width: 60%;
    }
  }
  @media(max-width: 1100px) {
    :host([open]) {
      width: 70%;
    }
  }
  @media(max-width: 800px) {
    :host([open]) {
      width: 90%;
      margin: auto;
    }
  }
    `;
  }

  togglePopup(){
    this.open = !this.open;
  }


  render() {
    return html`
    <i class="fas fa-times"></i>
    <slot></slot>
    `;
  }
}

customElements.define("vivo-popup-message", PopupMessage);
