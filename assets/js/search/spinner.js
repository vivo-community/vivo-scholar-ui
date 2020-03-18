import { LitElement, html, css } from "lit-element";

class SearchSpinner extends LitElement {

    constructor() {
        super();
    }

    static get styles() {
        return css`
        .spinner {
            /* Spinner size and color */
            width: 1.5rem;
            height: 1.5rem;
            border-top-color: #444;
            border-left-color: #444;
          
            /* Additional spinner styles */
            animation: spinner 400ms linear infinite;
            border-bottom-color: transparent;
            border-right-color: transparent;
            border-style: solid;
            border-width: 2px;
            border-radius: 50%;  
            box-sizing: border-box;
            display: inline-block;
            vertical-align: middle;
          }
          
          /* Animation styles */
          @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          
          /* Optional — create your own variations! */
          .spinner-large {
            width: 5rem;
            height: 5rem;
            border-width: 6px;
          }
          
          .spinner-slow {
            animation: spinner 1s linear infinite;
          }
          
          .spinner-blue {
            border-top-color: #09d;
            border-left-color: #09d;
          }
          
          `
    }

    render() {
        return html`<span class="spinner spinner-blue"></span>`
    }
}

customElements.define('vivo-search-spinner', SearchSpinner);