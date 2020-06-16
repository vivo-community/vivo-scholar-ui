import { LitElement, html, css } from "lit-element";

class SearchTruncatedTextResult extends LitElement {

  static get properties() {
    return {
      text: { type: String, attribute: true }
    }
  }

  constructor() {
    super();
  }

  //https://stackoverflow.com/questions/822452/strip-html-from-text-javascript/47140708#47140708
  strip(html) {
    // not sure why 'null' is getting this far
    if (!html || typeof(html) == 'undefined' || html == 'null') {
      return ""
    }
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  static get styles() {
    // TODO: not sure how to make max-lines a component property
    return css`
    /* https://css-tricks.com/line-clampin/ */
        :host {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .truncate-overflow {
          --max-lines: 3;
          position: relative;
          max-height: calc(var(--lh) * var(--max-lines));
          overflow: hidden;
        }
      `
  }

  render() {
    let display = this.strip(this.text);
    return html`
      <div class="truncate-overflow">
          ${display}
      </div>
      `
  }

}

customElements.define("vivo-search-truncated-text-result", SearchTruncatedTextResult);
