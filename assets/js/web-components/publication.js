class Publication extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .title {
          font-size: 20px;
          background-color: lightblue;
          color: white;
        }
        .abstract {
          padding: 0.5em;
        }
      </style>
        <div class="title">
          <a href="/entities/publication/${this.getAttribute("id")}">
           <slot name="title"/>
           </a>
       </div>
       <div class="abstract">
        <slot name="abstract"/>
       </div>
    `;
  }
}

customElements.define('vivo-publication', Publication)
