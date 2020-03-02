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
        display: block;
        width: 100%;
        max-width: 300px;
        margin: 0 !important;
        z-index: 10;
      }
      .fas {
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        color: white;
        font-size: 2em;
        -webkit-font-smoothing: antialiased;
      }
      .fa-bars::before {
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        content: "\\f0c9";
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
        :host([large]) #navigation {
         top: 150px;
       }
       :host([large]) ::slotted([slot="title"]) {
         max-width: 380px;
       }
      }
      @media (max-width: 725px){
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
          top: 75px;
          z-index: 99;
        }
        #menu {
          display: none;
        }
        #menu.open {
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 12.5px 0;
          background-color: var(--primaryColor);
          width: 100%;
        }
        ::slotted([slot="menu-icon"]){
          color: white;
          font-size: 2em;
        }
        ::slotted([slot="nav-item"]){
          font-size: 1em;
          padding: 7.5% 0 7.5% 0;
          margin: 0;
          text-align: center;
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
        <i id="menu-icon" class="fas fa-bars" aria-hidden=”true”></i>
        <span hidden>Menu</span>
      </button>

    `;
  }

}

customElements.define('vivo-site-header', SiteHeader);
