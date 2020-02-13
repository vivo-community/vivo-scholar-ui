import { LitElement, html, css } from "lit-element";

class SiteHeader extends LitElement {


  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row nowrap;
        margin: 0;
        padding: 0 50px;
        width: 100vw;
        background-color: var(--primaryColor);
        color: white;
        height: 75px;
        justify-content: space-between;
        align-items: center;
      }
      ::slotted([slot="title"]) {
        font-size: 3em !important;
        margin: 0 !important;
        z-index: 10;
      }
      #menu{
        display: flex;
        flex-flow: row nowrap;
        color: white;
        justify-content: space-evenly;
      }
      ::slotted([slot="nav-item"]){
        font-size: calc(1em + .5vw);
        margin-right: 10%;
        text-decoration: none;
        color: white !important;
        white-space: nowrap;
      }
      #menu-button {
        display: none;
      }
      @media (min-height: 400px) {
        :host([large]) {
          height: 150px;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 5em !important;
        }
        :host([large]) #navigation {
         top: 150px;
       }
      }
      @media (max-width: 1024px){
        ::slotted([slot="title"]) {
          font-size: 2.5em !important;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 3em !important;
        }
      }
      @media (max-width: 700px){
        #menu-button {
          display: flex;
          background: none;
          border: none;
          padding: 0;
        }
        #navigation {
          background-color: var(--primaryColor);
          width: 100%;
          margin:0;
          padding: 0;
          position: absolute;
          left: 0;
          top: 100px;
          z-index: 99;
        }
        #menu {
          display: none;
        }
        #menu.open {
          display: block;
          position: relative;
          margin: 0;
          padding: 50px 0 0 0;
          background-color: var(--primaryColor);
          width: 100%;
        }
        ::slotted([slot="menu-icon"]){
          color: white;
          font-size: 2em;
        }
        ::slotted([slot="nav-item"]){
          display: block;
          font-size: 1em;
          position: relative;
          padding: 7.5% 0 7.5% 0;
          margin: 0;
          text-align: center;
        }
      }

      @media (max-width: 530px) {
        ::slotted([slot="title"]) {
          font-size: 2em !important;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 2em !important;
        }
      }
      @media (max-width: 388px){
        ::slotted([slot="title"]) {
          font-size: 1.8em !important;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 1.8em !important;
        }
      }
      @media (max-width: 366px){
        ::slotted([slot="title"]) {
          font-size: 1.5em !important;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 1.5em !important;
        }
      }

    `
  }

  showNav(){
    const showMenu = this.shadowRoot.querySelector("#menu");
    const nav = this.shadowRoot.querySelector('#menu-button');
    if (showMenu.classList.contains('open')){
      showMenu.classList.remove('open');
      nav.setAttribute('aria-expanded', 'false');
    } else {
      showMenu.classList.add('open');
      nav.setAttribute('aria-expanded', 'true');
    }
  }

  render() {
    return html`
      <slot name="title"></slot>
      <nav id="navigation">
        <div id="menu">
          <slot name="nav-item"></slot>
        </div>
      </nav>
      <button id="menu-button"
        aria-haspopup="true" aria-expanded="false"
        @click="${this.showNav}">
        <slot name="menu-icon" aria-hidden=”true”></slot>
        <span hidden>Menu</span>
      </button>

    `;
  }

}

customElements.define('vivo-site-header', SiteHeader);
