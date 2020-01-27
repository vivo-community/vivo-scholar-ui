import {LitElement, html, css } from "lit-element";

class Course extends LitElement{

  static get styles() {
    return css `

      :host {
        margin-bottom: 0.75em;
        }
      ::slotted([slot="course-title"]) {
        font-weight: bold;
        margin-bottom: 0;
        }
      ::slotted([slot="course-role"]) {
        margin-top: 0;
        color: var(--darkNeutralColor);
        }
    `;
  }


  render() {
    return html `

    <slot name="course-title"></slot>
    <slot name="course-role"></slot>

    `;
  }
}

customElements.define("vivo-course", Course);
