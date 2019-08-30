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
          transform-origin: 77px 18px;
          font-size: 18px;
          line-height: 20px;
          font-family: "Red Hat Text";
          font-weight: 700;
          font-size: 19px;
          color: #2f3d4f;
          margin-bottom: 8px;
        }
        .title a {
          color: #007bff;
          text-decoration: none;
          background-color: transparent;
        }
        .abstract {
          padding: 0.5em;
        }
        .date {
          font-size: 13px;
          font-style: italic;
        }
      </style>
        <div class="title">
          <a href="/entities/publication/${this.getAttribute("id")}">
           <slot name="title"/>
          </a>
       </div>
       <div class="date">
         <slot name="date"/>
       </div>
       <div class="abstract">
          <slot name="abstract"/>
       </div>
    `;
  }
}

customElements.define('vivo-publication', Publication)
