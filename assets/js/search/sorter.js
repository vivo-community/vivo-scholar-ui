import { LitElement, html, css } from "lit-element";

class SearchSorter extends LitElement {

    // NOT multi-select
    static get properties() {
        return {
            options: { type: Array },
            selected: { type: String }
        };
    }

    constructor() {
        super();
        // just hard-coding here for now
        this.options = [];
        this.handleSortSelected = this.handleSortSelected.bind(this);
    }

    handleSortSelected(e) {
        console.log(e);
        console.log(e.target);
        //console.log(e.getAttribute("value"));
        //this.selected = ?

        var value = e.target.getAttribute("value");
        
        // not getting any value so far
        if (!value) {
            console.error('no value for sorter');
            return;
        }

        const [field, direction] = value.split("-", 2);

        // also, reset paging?  
        this.dispatchEvent(new CustomEvent('sortSelected', {
            detail: { value: field, direction: direction },
            bubbles: true,
            cancelable: false,
            composed: true
        }));
    }


    //?selected=${this.selected === option.value}
    render() {
        return html`<select @change="${this.handleSortSelected}">
          ${this.options.map(option => html`
            <option 
              value="${option.field}-${option.direction}">
              ${option.label}
            </option>
          `)}
        </select>`
    }
}

customElements.define('vivo-search-sorter', SearchSorter);