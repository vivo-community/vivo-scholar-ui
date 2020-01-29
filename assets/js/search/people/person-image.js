import { LitElement, html, css } from "lit-element";

class PersonImage extends LitElement {
    static get properties() {
      return {
        thumbnail: { type: String }
      }
    }
  
    render() {
      // TODO: how to get 'assetPath' in here?
      var url = `${defaultProfileImage}`;
  
      // baseImageUrl
      if (this.thumbnail != "null") {
        url = `${baseImageUrl}${this.thumbnail}`;
      }
      return html`
          <img className="img-thumbnail" width="90" src="${url}" />
          `
    }
  }
  customElements.define('vivo-person-card-image', PersonImage);
  