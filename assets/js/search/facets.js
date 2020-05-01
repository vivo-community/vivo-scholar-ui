import { LitElement, html, css } from "lit-element";

import Faceter from './faceter.js'

import * as config from './config.js'
class SearchFacets extends Faceter(LitElement) {

  static get properties() {
    return {
        field: { type: String }, // e.g. researchAreas
        key: { type: String }, // e.g. people
        tag: { type: String, attribute: true }, // e.g. SOLR "tag"
        opKey: { type: String, attribute: true } // EQUALS, RAW etc...
    }
  }

  constructor() {
    super();
    this.tag = ""; // default no tagging
    this.opKey = "EQUALS"; // default to EQUALS compare
    this.popupThreshold = config.FACET_POPUP_THRESHOLD;
    this.showCount = config.FACETS_SHOW;
    this.togglePopup = this.togglePopup.bind(this);

    this.toggleList = this.toggleList.bind(this);
  }

  static get styles() {
    return css`
      :host {
        display: block;
        line-height: 1.6em;
        padding-bottom: 1em;
      }
      vivo-search-facet[selected=""] {
        font-weight: bold;
      }
      :host p {
        opacity: 50%;
        font-size: 1em;
        font-weight: normal;
        margin: 0;
        text-decoration: underline;
      }
      :host p:hover {
        cursor: pointer;
      }
      .entire-facet-list {
        padding: 0;
        margin: 0;
        display: block;
      }
      ::slotted(h4) {
        padding: 0;
        margin: 0;
      }
      ::slotted([slot="show-more"]) {
        display: none;
      }
      ::slotted([slot="show-less"]) {
        display: none;
      }   
      ::slotted([slot="popup-heading"]) {
        display: none;
      }         
      @media screen and (max-width: 1000px) {
        .entire-facet-list {
          display: none;
        }     
        ::slotted(h4:hover) {
          cursor: pointer;
        }
        ::slotted(h4)::after {
           content: " >";
        }
      }      
    `
  }

  togglePopup() {
    let popup = this.shadowRoot.querySelector("#popup-facets");

    if (popup.getAttribute("open")) {
      popup.closeDown();
    } else {
      popup.openUp();
      // when open popup - need to 'reset' filters
      popup.setFilters(this.filters);
    }
  }

  toggleList(e) {
    let list = this.shadowRoot.querySelector(".entire-facet-list");
    if (list.style.display == 'none' || !list.style.display) {
      list.style.display = 'block';
    } else {
      list.style.display = 'none';
    }
  }

  generateFacetToggle(showList) {
    let coordinator = document.querySelector('vivo-search-navigation');
    let more = coordinator.shadowRoot.querySelector('slot[name="show-more"]').assignedNodes()[0].textContent;
    let less = coordinator.shadowRoot.querySelector('slot[name="show-less"]').assignedNodes()[0].textContent;
    let results = html`<vivo-search-facet-toggle>
      ${this.generateFacetList(showList)}
      <span slot="show-more">${more}</span>
      <span slot="show-less">${less}</span>
    </vivo-search-facet-toggle>`
    return results;
  }

  // FIXME: various i18n problem
  // <div slot="popup-heading">?
  generateFacetPopup(showList) {
    // FIXME: this is getting the title of popup from
    // <h4> which means <h4> is required in slot
    // TODO: maybe default to h4 unless popup-heading 
    let heading = this.querySelector("h4");
    let headingText = `Filter ${heading.innerText}`;
    let help = "Start typing to find a specific filter result";
    let cancel = "Cancel";
    let apply = "Apply";
    let more = "Show More";

    var results = html`
    <p id="toggle-facet" @click=${this.togglePopup}>${more}</p>
    <vivo-facet-popup-box id="popup-facets" placeholder="${help}">
      <div slot="heading">${headingText}</div> 
      ${this.generateFacetList(showList)}
      <span slot="cancel">${cancel}</span>
      <span slot="apply">${apply}</span>
    </vivo-facet-popup-box>`;
    return results;
  }

 generateHiddenFacetList(content, hideList) {
  if (content.length > this.popupThreshold) { 
    // make selected drift to top?
    // the pop-up needs all options
    return this.generateFacetPopup(content)
  } else  {
    // how to send in more/less
    return this.generateFacetToggle(hideList);
  }
 }

  generateFacetList(content) {
    let facetList = content.map(facet => {
      let selected = this.inFilters(this.field, facet);   
      return html`<vivo-search-facet
        category="${this.key}"
        tag="${this.tag}"
        opKey="${this.opKey}"
        field="${this.field}"
        ?selected=${selected}
        value="${facet.value}" 
        label="${facet.value}" 
        count="${facet.count}">
        </vivo-search-facet>`
      });
    return facetList;
  }

  render() {
    if (!this.data) {
      return html``
    }
    // NOTE: it's an array - but only want first
    let content = this.data[0].entries.content;

    var showList = content.slice(0,this.showCount);
    var hideList = content.slice(this.showCount);

    let hiddenSelected = hideList.filter(facet => 
       this.inFilters(this.field, facet)
    );

    let isPopup = (content.length > this.popupThreshold) ? true : false; 
    
    // if it's NOT a popup - then make a selected facet
    // show up on sidebar - no matter if show more/less is chosen
    if (!isPopup) {
      showList = _.concat(showList, hiddenSelected);
      hideList = _.difference(hideList, hiddenSelected);
    } else {
      showList = _.concat(showList, hiddenSelected);
    }
    
    let showHtml  = this.generateFacetList(showList);
    let hideHtml = (hideList.length > 0) ? this.generateHiddenFacetList(content, hideList): html``;
    
    return html`
        <slot @click="${this.toggleList}"></slot>
        <div class="entire-facet-list">
        ${showHtml}
        ${hideHtml}
        </div>
      `
    }

}
  
customElements.define('vivo-search-facets', SearchFacets);
  