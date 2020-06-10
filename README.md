# Vivo Scholar UI
A possible front-end to the [Scholars Discovery](https://github.com/vivo-community/scholars-discovery) GraphQL endpoint.  

## Technology
* [Go Buffalo](http://gobuffalo.io) - for server side rendering, and asset pipeline
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
     cp .env.example .env

Update the value of GRAPHQL_ENDPOINT to the address of a running instance of Scholars Discovery. The default
value of one running locally has been prepopulated in .env.example.

Set the SITE_ORGANIZATION_ID value to the institution's root organization id. 

### Native
     buffalo dev

### Docker Only
     docker-compose up

The app will be available at: [http://localhost:4200](http://localhost:4200)

## Philosophy
It should be easy to add and/or customize pages with basic knowledge of HTML and GraphQL.

Pages are represented by a template file and corresponding GraphQL query file.
Adding new or editing existing templates and queries are the expected means of customization.

Web Components will be the primary method of encapsulating of core styles and behaviors.
They can be used to build new templates and will also provide embeddable 'widgets' for
use on other sites.

Server side rendering should be used for most pages where primary content is part of the
document and then progressively enhanced with javascript. Searches and other complex UIs
will be an exception.

## Pages and Queries
* "/"
    * Template: templates/index.html
    * Query: no query
* "/entities/{type}/{id}" - fetches data for the given entity by 'id'
    * Template: templates/entity_pages/{type}.html
    * Query: templates/entity_pages/{type}.graphql
    * Query Parameters: id
* "/search/{type}" - search pages, any html/javascript
    * Template: templates/search_pages/{type}.html
    * Query: assumes javascript will query GraphQL endpoint directly
* "/pages/{name}" - generic pages, any/html javascript with optional GraphQL query
    * Template: templates/any_pages/{name}.html
    * Query (optional): templates/any_pages/{name}.graphql
    * Query Parameters: Dynamic, derived from query string
    * [Adding an Any Page](http://localhost:4200/docs/elements/any-page)

## Theme

Theme variables are set using the environment. The default values are populated in .env.example. Configurable theme variables include:

* Site Name - TODO
* Site Logo - TODO
* Home Page Background (image or color) - TODO
* Color Palette: [http://localhost:4200/docs/elements/color-palette](http://localhost:4200/docs/elements/color-palette)

Additionally, custom styles may be added to:

assets/css/theme.scss

This file will be pre-processed with SASS and imported after all default stylesheets to allow specific overrides.
