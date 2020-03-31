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
      }
    `
  }
    render() {
      // TODO: how to get 'assetPath' in here?
      var url = `${defaultProfileImage}`;
  
      // baseImageUrl
      if (this.thumbnail != "null") {
        url = `${baseImageUrl}${this.thumbnail}`;
      }
      return html`
          <img class="img-thumbnail" width="130" src="${url}" />
          `
    }
  }
  customElements.define('vivo-person-card-image', PersonImage);
  