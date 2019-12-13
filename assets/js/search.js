import { Router } from '@vaadin/router';
import { LitElement, html, css } from "lit-element";
import qs from "qs";
import _ from "lodash";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

const search = document.getElementById('search');
const router = new Router(search, {baseUrl: '/search/'});

import peopleQuery from "./people/query";
import client from "./lib/apollo";

import EventBus from "./lib/event-bus.js";

router.setRoutes([
    { path: '', component: 'vivo-search' },
    { path: 'people', component: 'vivo-search' }//,
    //{path: '/entities/person/:id+', redirect: '/entities/person/:id+'},
]);

function stringifyQuery(params) {
    let result = qs.stringify(params);
    return result ? "?" + result : "";
}

function parseQuery(qryString) {
    return qs.parse(qryString);
}

/*
    <div className="card" key={person.id} style={cardStyle}>
      <h6 className="card-header">
        <a href={"/entities/person/" + person.id}>{personName}</a>
      </h6>

      <div className="card-body">
        <p className="card-text">{title}</p>
        <div className="card-footer">
          <PersonImage person={person} />
        </div>
      </div>
    </div>

      let title = person.preferredTitle || person.id;
  // NOTE: terrible way to do this
  let personName = person.name.replace("@en-US", "");
    */

class PersonImage extends LitElement {
   static get properties() {
        return {
            thumbnail: { type: String }
        }
    }

    render() {
        // TODO: how to get 'assetPath' in here?
        var url = "http://openvivo.org/images/placeholders/person.bordered.thumbnail.jpg";

        if (this.thumbnail != "null") {
            //console.log(this.thumbnail);
            url = `http://openvivo.org/${this.thumbnail}`;
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

// make a PeopleSearch, PublicationSearch etc... (each tab)
// const subscription = eventBus.subscribe('event', arg => console.log(arg))

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
        const defaultSearch = parsed.search ? parsed.search : "*";
        this.query = defaultSearch;

        this.runSearch()
        this.doSearch = this.doSearch.bind(this);
    }

    onAfterEnter(location, commands, router) {
        const parsed = parseQuery(location.search.substring(1));
        const defaultSearch = parsed.search ? parsed.search : "*";
        this.query = defaultSearch;
    }


    connectedCallback() {
        super.connectedCallback();        
        this.addEventListener('vaadin-router-location-changed', this.locationChanged);
        EventBus.register("searchSubmitted", this.doSearch);
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
            ${_.map(results, function(i) { 
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
                    ${i.overview?
                        html`<vivo-truncated-text>${unsafeHTML(i.overview)}</vivo-truncated-text>`:
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
