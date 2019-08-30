class Publication extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <li>
        <span class="title">
          <a href="/entities/publication/${this.getAttribute("id")}">
           ${ this.getAttribute("title") }
          </a> 
        </span>
      </li>
    `;
  }
}

customElements.define('vivo-publication', Publication)
