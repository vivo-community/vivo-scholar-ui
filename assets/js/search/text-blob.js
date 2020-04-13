import { LitElement, html, css } from "lit-element";

class TextBlob extends LitElement {

    constructor() {
        super();
    }

    //https://stackoverflow.com/questions/822452/strip-html-from-text-javascript/47140708#47140708
    strip(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    firstUpdated() {
        // FIXME: this seems like the wrong way to go about this...
        const slot = this.shadowRoot.querySelector('slot');
        console.log(slot);
        console.log(slot.assignedNodes({flatten: true}));
        //let currentHtml = slot.assignedNodes()[0].innerHTML;
        //console.log(currentHtml);
        //let newHtml = this.strip(currentHtml);
        //slot.assignedNodes()[0].innerHTML = newHtml;
    }

    static get styles() {
        return css`
        :host {
            --lh: 1.2rem;
            line-height: var(--lh);  
        }
        /* https://css-tricks.com/line-clampin/ */
        .truncate-overflow {
            --max-lines: 2;
            position: relative;
            max-height: calc(var(--lh) * var(--max-lines));
            overflow: hidden;
            padding-right: 1rem; /* space for ellipsis */
          }
          .truncate-overflow::before {
            position: absolute;
            // FIXME: this overlaps text in chrome */
            /* content: "..."; */
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
        return html`
        <div class="truncate-overflow">
          <slot></slot>
        </div>
      `
    }

}

customElements.define("vivo-search-text-blob", TextBlob);
