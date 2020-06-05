import { LitElement, html, css } from "lit-element";

class PersonImage extends LitElement {
  static get properties() {
    return {
      thumbnail: { type: String },
      default: { type: String }
    }
  }

  static get styles() {
    return css`
      .img-thumbnail {
        border: 3px solid #F3F2F1;
        width: 130px;
      }

      @media screen and (max-width: 1000px) {
        .img-thumbnail {
          width: 110px;
        }
      }
    `
  }

  render() {
    var url = this.default ||  '';

    if (this.thumbnail != "null") {
      url = `${this.thumbnail}`;
    }
    return html`
          <img class="img-thumbnail" src="${url}" />
          `
  }
}
customElements.define('vivo-person-card-image', PersonImage);
