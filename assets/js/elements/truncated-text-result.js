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
        :host {
            --lh: 1.2rem;
            line-height: var(--lh);  
        }
        /* https://css-tricks.com/line-clampin/ */
        .truncate-overflow {
          --max-lines: 3;
          position: relative;
          max-height: calc(var(--lh) * var(--max-lines));
          overflow: hidden;
          padding-right: 1rem; /* space for ellipsis */
        }
        .truncate-overflow::before {
          position: absolute;
          /* FIXME: this is not consistent in Chrome vs. Firefox */
          content: "..."; 
          inset-block-end: 0; /* "bottom" */
          inset-inline-end: 0; /* "right" */
        }
        .truncate-overflow::after {
          content: "";
          position: absolute;
          inset-inline-end: 0; /* "right" */
          width: 1rem;
          height: 1rem;
          background: white;
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
