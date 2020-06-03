import { LitElement, html, css } from "lit-element";

class PersonImage extends LitElement {
  static get properties() {
    return {
      thumbnail: { type: String }
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
    // FIXME: how to best get this value in?
    let defaultProfileImage = "";
    if (process.env.DEFAULT_PROFILE_IMAGE != undefined) {
        defaultProfileImage = `${process.env.DEFAULT_PROFILE_IMAGE}`
    }
    // ??
    var url = `/assets/images/${defaultProfileImage}`;

    if (this.thumbnail != "null") {
      url = `${this.thumbnail}`;
    }
    return html`
          <img class="img-thumbnail" src="${url}" />
          `
  }
}
customElements.define('vivo-person-card-image', PersonImage);
