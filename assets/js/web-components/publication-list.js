class PublicationList extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML =  `
        <style>
          :host {
            display: block;
          }
          ::slotted(vivo-publication) {
            margin-bottom: 1em;
          }
          ::slotted(vivo-publication) {
            font-size: 20px;
            border: 1px solid lightgray;
          }
        </style>
        <slot />
    `;
  }
}

customElements.define('vivo-publication-list', PublicationList)
