import { LitElement, html, css } from "lit-element";

/*
NOTE: trying to combine ideas from these two pages:
https://css-tricks.com/line-clampin/
https://paulbakaus.com/tutorials/css/multiline-truncated-text-with-show-more-button-with-just-css/
*/
class TruncatedText extends LitElement {

    firstUpdated(props) {
        var shadow = this.shadowRoot
        const ps = shadow.querySelectorAll('div');
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const action = entry.target.scrollHeight > Math.round(entry.contentRect.height) ? 'add' : 'remove';
                entry.target.classList[action]('truncated');
                if (action == 'remove') {
                    entry.target.classList['add']('full-text');
                } else {
                    entry.target.classList['remove']('full-text');
                }
            }
        });
        ps.forEach(p => {
          observer.observe(p);
        });
    }

    static get styles() {
        return css`
      :host {
        display: block;
      }
      input {
        opacity: 0;
        position: absolute;
        pointer-events: none;
      }
      label {
          color: var(--linkColor);
      }
      input:focus ~ label {
        outline: -webkit-focus-ring-color auto 5px;
      }
      div.full-text + label.read-more { display: none; }
      div:truncated + label.read-more { display: block; }
      div.full-text::before {
        content: "";
      }
      input:checked + div {
        overflow: unset;
      }
      input:checked ~ label {
        display: none;
      }

      input:checked + div::before {
        content: "";
      }

      .truncate-overflow {
        --max-lines: 2;
        --lh: 1.3em;
        line-height: var(--lh);
        position: relative;
        max-height: calc(var(--lh) * var(--max-lines));
        overflow: hidden;
        padding-right: 1rem;
      }

      .truncate-overflow::before {
        position: absolute;
        content: "...";
        inset-block-end: 0; 
        inset-inline-end: 0;
      }

      .truncate-overflow::after {
        content: "";
        position: absolute;
        inset-inline-end: 0;
        width: 1rem;
        height: 1rem;
        background: white;
     }
    `;
    }

    render() {
        return html`
    <input type="checkbox" id="expanded">
    <div class="truncate-overflow full-text">
      <slot id="pub-abstract"></slot>
    </div>
    <label for="expanded" role="button" 
      aria-label="Show full abstract of publication" 
      class="read-more">(More)</label>
    `;
    }
}

customElements.define("vivo-truncated-text", TruncatedText);
/*

TODO:
1. Ideally (More) button would be right next to ellipsis, and position
   of ellipsis would be always right after last character of truncated
   text
*/