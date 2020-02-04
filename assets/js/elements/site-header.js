import { LitElement, html, css } from "lit-element";
import { FontAwesomeIcon } from '@fortawesome/fontawesome-free';

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
        :host([large]) #navigation {
         top: 150px;
       }
      }
      @media (max-width: 415px) {

        #menu-button {
          display: flex;
          margin-left: 5%;
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
          color: #FFFFFF;
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
        ::slotted([slot="title"]) {
          font-size: 2em !important;
        }
        :host([large]) ::slotted([slot="title"]) {
          font-size: 2em !important;
          padding-bottom: 13%;
        }
        :host([large]) #menu-button {
          display: flex;
          margin-left: 5%;
          margin-bottom: 13%;
        }
      }
    `
  }

  showNav(){
    const showMenu = this.shadowRoot.querySelector("#menu");
    if (showMenu.classList.contains('open')){
      showMenu.classList.remove('open');
    } else {
      showMenu.classList.add('open');
    }
  }


  render() {
    return html`
      <slot name="title"></slot>
      <button id="menu-button" @click="${this.showNav}"><slot name="menu-icon" aria-hidden=”true”></slot></button>
      <nav id="navigation" >
        <div id="menu">
          <slot name="nav-item"></slot>
        </div>
      </nav>

    `;
  }

}

customElements.define('vivo-site-header', SiteHeader);
