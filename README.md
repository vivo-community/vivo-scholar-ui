# Scholars WebComponent UI

A front-end to the [Scholars Discovery](https://github.com/vivo-community/scholars-discovery) GraphQL endpoint.  **NOTE** This project does nothing without a running instance of `scholars-discovery`.  To get that running see [Getting Started](#getting-started)

## Technology
* [Go Buffalo](http://gobuffalo.io) - for server side rendering, and asset pipeline
* [Web Components](https://www.webcomponents.org/specs/) - for UI components as well as search 
* [LitElement](https://lit-element.polymer-project.org/) - for generating web components

## Development Dependencies

### Native
* [Go](https://golang.org/) (>= version 1.12)
* [Go Buffalo](http://gobuffalo.io) (>= version 0.14.10)
* [Yarn](https://yarnpkg.com)

### OR: Docker Only
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Scholars Discovery

`Scholars WebComponent UI` is a meant to be run atop a running instance of `scholars-discovery`, which in turn imports data from a `VIVO` instance

See [Scholars Discovery](https://github.com/vivo-community/scholars-discovery) for more details about importing data and getting started

### Scholars WebComponent UI
     cp .env.example .env

Update the value of GRAPHQL_ENDPOINT to the address of a running instance of Scholars Discovery. The default
value of one running locally has been prepopulated in `.env.example`

Set the SITE_ORGANIZATION_ID value to the institution's root organization id 

#### Native
     buffalo dev

#### Docker Only
     docker-compose up

The app will be available at: [http://localhost:4200](http://localhost:4200)

#### Background

The underlying motivation of this project is to make it easier to customize the UI of VIVO.  It should be easy to add and/or customize pages with basic knowledge of HTML, GraphQL and Javascript - no Sparql, freemarker templates, listview-config etc... 

Pages are represented by a template file and corresponding GraphQL query file. Adding new or editing existing templates and queries are the expected means of customization.

Web Components are the primary method of encapsulating core styles and behaviors. They can be used to build new templates and will also provide embeddable 'widgets' for use on other sites.

Server side rendering should be used for most pages where primary content is part of the document and then progressively enhanced with javascript. Searches and other complex UIs will be an exception.

#### Pages and Queries

URL routing determines what content to serve. It is highly flexible, but the core idea is sending the results of a `GraphQL` query as data into a template.  What query and what template are determined by the route

#### Routes

##### Base

* "/"
    * Template: templates/index.html
    * Query: no query

##### Entity Pages 

Such as for a person, publication, grant etc...

* "/entities/{type}/{id}" - fetches data for the given entity by 'id'
    * Template: templates/entity_pages/{type}.html
    * Query: templates/entity_pages/{type}.graphql
    * Query Parameters: id

##### Search 

The search is essentially an SPA

* "/search/{type}" - search pages, any html/javascript
    * Template: templates/search_pages/{type}.html
    * Query: assumes javascript will query GraphQL endpoint directly

##### List Pages

Although the purpose is already served by the search, there is also the capability of adding a browseable list of all entities.  The examples here are rudimentary, since our demo site does not use the list views

* "/lists/{type}" - search pages, any html/javascript
    * Template: templates/list_pages/{type}/{type}.html
    * Query: templates/list_pages/{type}/{type}.graphql

This will send also accept paging parameters  

##### Any Pages

Very flexible pages that can contain anything

* "/pages/{name}" - generic pages, any/html javascript with optional GraphQL query
    * Template: templates/any_pages/{name}.html
    * Query (optional): templates/any_pages/{name}.graphql
    * Query Parameters: Dynamic, derived from query string
    * [Adding an Any Page](http://localhost:4200/docs/elements/any-page)

#### Sitemaps

Sitemaps for SEO purposes - so that search indexing services have a list of links to 
work with. 

* "sitemap_pages/sitemap.xml" - main page that is a link to other (buildable) sitemaps
    * Template: templates/sitemap_pages/sitemap.xml
* "sitemap_pages/{type}/{type}.xml" - a sitemap file per specifications.  It will run the
  backing GraphQL query and send data to the template
    * Template: templates/sitemap_pages/{name}/{name}.xml
    * Query: templates/sitemap_pages/{name}/{name}.graphql


#### Theme (Customizing)

Theme variables are set using the environment. The default values are populated in `.env.example`

Configurable theme variables include:

* Site Name - TODO
* Site Logo - TODO
* Home Page Background (image or color) - THEME_BACKGROUND_IMAGE
* Color Palette: [http://localhost:4200/docs/elements/color-palette](http://localhost:4200/docs/elements/color-palette)

Additionally, custom styles may be added to:

assets/css/theme.scss

This file will be pre-processed with SASS and imported after all default stylesheets to allow specific overrides.

#### Embeddable Components

#### Advanced

Since all entity pages, and the searches, are merely templates matched up with GraphQL queries - it is fairly easy to customize what data is retrieved and shown on a page.

The search works the same, but to explain further - if you wanted to add your own facets TODO

if you wanted to add your own search ... TODO
