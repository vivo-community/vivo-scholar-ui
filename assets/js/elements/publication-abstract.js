import { LitElement, html, css } from "lit-element";

/*
NOTE: trying to combine ideas from these two pages:
https://css-tricks.com/line-clampin/
https://paulbakaus.com/tutorials/css/multiline-truncated-text-with-show-more-button-with-just-css/
*/
class PublicationAbstract extends LitElement {

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
      input:focus ~ label {
        outline: -webkit-focus-ring-color auto 5px;
      }
      div.full-text + label.read-more { display: none; }
      div:truncated + label.read-more { display: block; }
      input:checked + div {
        overflow: revert;
      }
      input:checked ~ label {
        display: none;
      }

      input:checked + div::before {
        content: "";
      }

      .truncate-overflow {
        --max-lines: 2;
        --lh: 1.2rem;
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
    <label for="expanded" role="button" class="read-more">(More)</label>
    `;
    }
}

customElements.define("vivo-publication-abstract", PublicationAbstract);
/*

TODO:
1. Make 'Show More' color like link
2. Have 'Show More' button hide when text is not truncated
3. Fix ellipsis placement - far to right - too much space etc...
*/