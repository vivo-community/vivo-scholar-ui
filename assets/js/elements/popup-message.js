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
      background: white;
      overflow: scroll;
      position: fixed;
      text-align: center;
      line-height: normal;
      height: 40%;
      width: 30%;
      transform: translate(15%,-60%);
      margin: 1em;
      margin-right: 2em;
      margin-left: 2em;
      padding-bottom: 1.2em;
      scrollbar-base-color:#ffeaff;
      scrollbar-width: thin;
      scrollbar-color: var(--thumbBG) var(--scrollbarBG);
      /* box-shadow: 5px 10px 8px #888888; */
      /* box-shadow: 5px 10px #888888; */
      /* box-shadow: 5px 10px; */
      box-shadow: 5px 10px 8px black;
    }
    :host([open]) .fas {
      display: inline-block;
      font-style: normal;
      font-variant: normal;
      text-rendering: auto;
      font-size: 1em;
      -webkit-font-smoothing: antialiased;
    }
    :host([open]) .fa-times::before {
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      content: "\\f00d";
    }
    div {
      background-color: var(--highlightBackgroundColor);
      margin: 0;
      padding: 0;
      display:flex;
      flex-direction: row;
      justify-content: flex-end;
      box-sizing: border-box;
    }
    .fas {
      padding-right: 1.3em;
      padding-top: .7em;
    }
    ::slotted([slot="title"]){
      margin-right: 10%;
      margin-left: 10%;
      padding-top: 2%;
    }
    ::slotted([slot="content"]){
      padding: 3% 10% 1.5% 12%;
      text-align: left;
      line-height: 1.6;
    }
    ::slotted([slot="link"]){
      text-decoration: none;
      color: black;
      font-weight: bold;
    }
  @media(max-width: 1050px) {
    :host([open]) {
      width: 45%;
      height: 40%;
      transform: translate(0,-55%);
    }
    ::slotted([slot="title"]){
      margin-right: 25%;
    }
  }
  @media(max-width: 900px) {
    :host([open]) {
      width: 50%;
      height: 35%;
      margin: auto;
      font-size: .9em;
      transform: translate(15%,-70%);
    }
    ::slotted([slot="title"]){
      /* margin-right: 20%; */
    }
  }
  @media(max-width: 700px) {
    :host([open]) {
      width: 50%;
      height: 30%;
      margin: auto;
      font-size: .9em;
      transform: translate(15%,-70%);
    }
    ::slotted([slot="title"]){
      margin-right: 15%;
    }
  }
  @media(max-width: 500px) {
    :host([open]) {
      width: 90%;
      height: 45%;
      margin: auto;
      font-size: .9em;
      transform: translate(0,-70%);
    }
    ::slotted([slot="title"]){
      margin-right: 15%;
    }
    ::slotted([slot="link"]){
      margin-bottom: 3%;
    }
  }
    `;
  }

  togglePopup(){
    this.open = !this.open;
  }


  render() {
    return html`
    <div>
    <slot name="title"></slot>
    <i class="fas fa-times"></i>
    </div>
    <slot name="content"></slot>
    <slot name="link"></slot>
    `;
  }
}

customElements.define("vivo-popup-message", PopupMessage);
