import { LitElement, html, css } from "lit-element";

class SearchSorter extends LitElement {

    // NOT multi-select
    static get properties() {
        return {
            options: { type: Array },
            selected: { type: String, attribute: true }
        };
    }

    constructor() {
        super();
        // just hard-coding here for now
        this.options = [];
        this.handleSortSelected = this.handleSortSelected.bind(this);
    }

    handleSortSelected(e) {
        let value = e.target.value;
        // not getting any value so far
        if (!value) {
            console.error('no value for sorter');
            return;
        }

        this.selected = value;
        const [field, direction] = value.split("-", 2);

        // also, reset paging?  
        this.dispatchEvent(new CustomEvent('sortSelected', {
            detail: { property: field, direction: direction },
            bubbles: true,
            cancelable: false,
            composed: true
        }));
    }


    isSelected(option) {
        // options look like this: 
        // {label: 'Name (asc)', field: 'name', 'direction': "ASC"},
        // TODO: not crazy about having to make this parseable version
        // option sort options over and over again
        let flag = (this.selected === `${option.field}-${option.direction}`);
        return flag;
    }

    render() {
        return html`<select @change="${this.handleSortSelected}">
          <option>Sort ...</option>
          ${this.options.map(option => 
            html`
            <option 
              ?selected=${this.isSelected(option)}
              value="${option.field}-${option.direction}">
              ${option.label}
            </option>
          `)}
        </select>`
    }
}

customElements.define('vivo-search-sorter', SearchSorter);