import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import peopleQuery from "./people/query";
import client from "./lib/apollo";

// use history?
//https://medium.com/@george.norberg/history-api-getting-started-36bfc82ddefc

/*
function stringifyQuery(params) {
    let result = qs.stringify(params);
    return result ? "?" + result : "";
}
*/

function parseQuery(qryString) {
    return qs.parse(qryString);
}

class PersonImage extends LitElement {
    static get properties() {
        return {
            thumbnail: { type: String }
        }
    }

    render() {
        // TODO: how to get 'assetPath' in here?
        var url = `${defaultProfileImage}`;

        // baseImageUrl
        if (this.thumbnail != "null") {
            url = `${baseImageUrl}${this.thumbnail}`;
        }
        return html`
        <img className="img-thumbnail" width="90" src="${url}" />
        `
    }
}
customElements.define('vivo-search-person-image', PersonImage);

class PersonCard extends LitElement {

    constructor() {
        super();
    }

    render() {
        return html`
        <h2>          
          <slot name="name" />
        </h2>
        <h3>
          <slot name="title" />
        </h3>
        <slot />
        `
    }
}

customElements.define('vivo-search-person', PersonCard);

// TODO?: make a PeopleSearch, PublicationSearch etc... (each tab)

class Search extends LitElement {

    static get properties() {
        return {
            query: { type: String },
            location: { type: Object },
            data: { type: Object }
        }
    }

    constructor() {
        super();
        const parsed = parseQuery(location.search.substring(1));
        const defaultSearch = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
        this.query = defaultSearch;

        // should this throw 'searchSubmitted' event?
        this.runSearch()
        this.doSearch = this.doSearch.bind(this);
        // decide what tab to show here?
        // catch all clicks? 
        //window.addEventListener("click", handleButtonClick);
    }

    handlePopState(e) {
       //console.log(e);
       //console.log(history);
       var searchParams = new URLSearchParams(window.location.search);
       console.log(`searchParams=${searchParams.toString()}`);
    }
    
    // lit-element callback
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('searchSubmitted', this.doSearch);

        window.addEventListener("popstate", this.handlePopState);
        // NOTE: doSearch might need to be called/initiated by other events
        // such as searchChooseFacet or searchTabSelected etc...
    }

    // NOTE: just running 'peopleQuery' now - there will be
    // other queries (publications etc...)
    runSearch() {
        const fetchData = async () => {
            try {
                // supposed to be adding facets, filters here (from sidebar)
                // also paging ...
                const { data } = await client.query({
                    query: peopleQuery,
                    variables: {
                        pageNumber: 0,
                        search: this.query,
                        filters: []
                    }
                });
                this.data = data;
                // then update component properties?
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }

    doSearch(e) {
        // NOTE: 'type' of event switch?
        // case 'searchSubmitted' -> { }
        // case 'tabSelected' -> { }
        // case 'facetSelected' -> { }
        // etc ...
        this.query = e.detail;
        //const qry = stringifyQuery({ search: e.detail });
        // add it to the url
        // this would change
        /*
        https://javascriptplayground.com/url-search-params/
        */

        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", e.detail);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);

        this.runSearch()
    }

    static get styles() {
        return css`
          vivo-search-person-image {
              float:left;
              width: 10%;
          }
          vivo-search-person {
              float: left;
              width: 90%;
          }
          :host {
              display: block;
              clear: both;
          }
          
        `
    }

    render() {
        var results = [];
        if (this.data && this.data.personsFacetedSearch.content) {
            let content = this.data.personsFacetedSearch.content;
            _.each(content, function (item) {
                results.push(item);
            });
        }

        var count = this.data ? this.data.personsFacetedSearch.page.totalElements : 0;
        var resultsDisplay = html`<div>
            ${_.map(results, function (i) {
            let title = i.preferredTitle || i.id;

            // NOTE: the custom elements here might be better named with 'results'
            // e.g. vivo-search-person-results, or maybe just search-person-results?
            return html`<vivo-search-person-image thumbnail="${i.thumbnail}"></vivo-search-person-image>
                  <vivo-search-person>
                    <div slot="title">${title}</div>
                    <a slot="name" href="/entities/person/${i.id}">
                      ${i.name}
                    </a>
                    ${i.overview ?
                    html`<vivo-truncated-text>${unsafeHTML(i.overview)}</vivo-truncated-text>` :
                    html``
                } 
                  </vivo-search-person>
                `
        })
            }
        </div>`

        return html`        
          <p><strong>Searching</strong>:<em>${this.query};count=${count}</em></p>
          ${resultsDisplay}
        `
    }
}

customElements.define('vivo-search', Search);
