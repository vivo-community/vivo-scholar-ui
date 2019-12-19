import { Router } from '@vaadin/router';
import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

const search = document.getElementById('search');
const router = new Router(search, { baseUrl: '/search/' });

import peopleQuery from "./people/query";
import client from "./lib/apollo";

router.setRoutes([
    { path: '', component: 'vivo-search' },
    { path: 'people', component: 'vivo-search' }//,
    //{ path: 'publications', component: 'vivo-publication-search' }//,
]);

function stringifyQuery(params) {
    let result = qs.stringify(params);
    return result ? "?" + result : "";
}

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
    }

    onAfterEnter(location, commands, router) {
        const parsed = parseQuery(location.search.substring(1));
        const defaultSearch = (parsed.search && parsed.search.trim().length > 0) ? parsed.search : "*";
        this.query = defaultSearch;
    }

    locationChanged(location) {
        console.log(`location changed=${location}`);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('searchSubmitted', this.doSearch);
        // NOTE: doSearch might need to be called/initiated by other events
        // such as searchChooseFacet or searchTabSelected etc...
    }

    runSearch() {
        const fetchData = async () => {
            try {
                // supposed to be adding filters
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
        const qry = stringifyQuery({ search: e.detail });
        // add it to the url
        Router.go(`/search/${qry}`);
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

        var list = html`<ul>
            ${_.map(results, function (i) {
            let title = i.preferredTitle || i.id;

            return html`<div>
                  <vivo-search-person-image thumbnail="${i.thumbnail}">
                  </vivo-search-person-image>
                  <vivo-search-person>
                    <div slot="title">${title}</div>
                      <a slot="name" target="_blank" href="/entities/person/${i.id}">
                      ${i.name}
                      </a>
                    </div>
                    ${i.overview ?
                    html`<vivo-truncated-text>${unsafeHTML(i.overview)}</vivo-truncated-text>` :
                    html``
                } 
                  </vivo-search-person>

                </div>
                `
        })
            }
        </ul>`

        return html`
        <div id="main">
          <p><strong>Searching</strong>:<em>${this.query}</em></p>
          ${list}
        </div>
        
        
        
        `
    }
}

customElements.define('vivo-search', Search);
