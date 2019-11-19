import { LitElement, html, css } from "lit-element";

class Interval extends LitElement {

  static get properties() {
    return {
      intervalStart: { attribute: 'interval-start', type: String },
      intervalEnd: { attribute: 'interval-end', type: String },
      separator: { type: String },
      separateOpen: { attribute: 'separate-open', type: Boolean }
    }
  }

  constructor() {
    super();
    this.separator = "-";
    this.separateOpen = false;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        box-sizing: border-box;
        color: var(--darkNeutralColor);
      }
    `
  }

  render() {
    let separatorString = ` ${this.separator} `;
    let intervalParts = [this.intervalStart, this.intervalEnd];
    if (!this.separateOpen) {
      intervalParts = intervalParts.filter((p) => p != null && p != "");
    }
    return html`
      ${intervalParts.join(separatorString)}
    `
  }

}

customElements.define("vivo-interval", Interval);

