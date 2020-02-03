import { LitElement, html, css } from "lit-element";
import { FontAwesomeIcon } from '@fortawesome/fontawesome-free';

class SiteHeader extends LitElement {

  static get properties() {
    return {
      mobileNav: {
        attribute: "mobile-nav",
        type: Boolean
      }
    };
  }


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
        height: 100px;
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
        font-size: 1.5em;
        font-weight: bold;
        margin-right: 100px;
        text-decoration: none;
        color: white !important;
      }
      #menu-button {
        display: none;
      }
      @media (min-height: 400px) {
        :host([large]) {
          height: 150px;
          align-items: flex-end;
          padding-bottom: 20px;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 5em !important;
          padding-bottom: 20px;
        }
      }
      @media (max-width: 415px) {

        #menu-button {
          display: flex;
          margin-left: 5%;
          margin-bottom: 12%;
        }
        #navigation {
          background-color: var(--primaryColor);
          width: 100vw;
          margin:0;
          padding: 0;
          position: absolute;
          z-index: 9;
        }
        #menu {
          display: none;
        }
        #menu.open {
          display: block;
          position: absolute;
          margin: 0;
          padding: 50px 0 0 0;
          background-color: var(--primaryColor);
          width: 100vw;

        }
        ::slotted([slot="nav-item"]){
          display: block;
          font-size: 1em;
          position: relative;
          padding: 0 0 15% 35%;
          // margin: 0 0 0 35%;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 2em !important;
          padding-bottom: 12%;
        }
      }
    `
  }

  showNav(){
    const showMenu = this.shadowRoot.querySelector("#menu")
    if (showMenu.classList.contains('open')){
      showMenu.classList.remove('open');
    } else {
      showMenu.classList.add('open');
    }
  }

  render() {
    return html`
      <slot name="title"></slot>
      <button id="menu-button" @click="${this.showNav}"><i class="fas fa-bars"></i>Menu</button>
      <nav id="navigation">
        <div id="menu">
          <slot name="nav-item"></slot>
        </div>
      </nav>

    `
  }

}

customElements.define('vivo-site-header', SiteHeader);
