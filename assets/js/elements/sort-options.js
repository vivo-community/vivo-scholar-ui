import { LitElement, html, css } from "lit-element";

class SortOptions extends LitElement {

    static get properties() {
        return {
            options: { type: Array }
        };
    }

    constructor() {
        super();
        this.options = [];
        this.findOptions();
        //console.log("find options");    
    }

    getOptions() {
        console.log(`getOptions()->${JSON.stringify(this.options)}`);
        return this.options;
    }

    // <vivo-sort-option field="publishedDate" direction="asc" label="Oldest First" />
    findOptions() {
        this.searchOptions = Array.from(this.querySelectorAll('vivo-sort-option'));
        // gather in different ways - once for display
        this.options = this.searchOptions.map(opt => {
            const label = opt.getAttribute("label");
            const field = opt.getAttribute("field");
            const direction = opt.getAttribute("direction");
            return {property: field, direction: direction, label: label}
        });
        console.log(`options=${JSON.stringify(this.options)}`);
    }
}

customElements.define('vivo-sort-options', SortOptions);