import { LitElement, html, css } from "lit-element";

class SearchSortOptions extends LitElement {

    // NOT multi-select
    static get properties() {
        return {
            options: { type: Array },
            selected: { type: String }
        };
    }

    constructor() {
        super();
        this.handleSortSelected = this.handleSortSelected.bind(this);
        // parent should always be search
        // go ahead and parse out every <vivo-search-option>
        this.findOptions();
    }

    findOptions() {
        this.searchOptions = Array.from(this.querySelectorAll('vivo-search-sort-option'));
        // gather in different ways - once for display
        this.options = this.searchOptions.map(opt => {
            const label = opt.getAttribute("label");
            const field = opt.getAttribute("field");
            const direction = opt.getAttribute("direction");
            return {label: label, field: field, direction: direction}
        });
    }

    handleSortSelected(e) {
        let value = e.target.value;
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

    static get styles() {
        return css`
          :host {
            display: block;
          }
          select::before {
            content: var(--lumo-icons-chevron-down);
            color: var(--textColor);
            background-color: var(--lightNeutralColor);
          }
          select {
            font-size: 1em;
            line-height: 1em;
            min-height: 1em;
            padding: 0 0.25em;
          }
          option {
            font-weight:normal;
            line-height: 1.6em;
            padding: 0.5em 1em;
          }
        `
    }

    isSelected(option) {
        // options look like this: 
        // {label: 'Name (asc)', field: 'name', 'direction': "ASC"},
        let flag = (this.selected === `${option.field}-${option.direction}`);
        return flag;
    }
    
    render() { 
        return html`
        <select @change="${this.handleSortSelected}">  
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

customElements.define('vivo-search-sort-options', SearchSortOptions);