# Vivo-Scholar
This a possible front-end to the vivo-scholar-discovery GraphQL endpoint.  

# Using

[Go Buffalo](http://gobuffalo.io) - for server side rendering, and asset pipeline

[React](https://reactjs.org/) - for client side code

[SkateJS](https://skatejs.netlify.com) - for generating web-components

## Quick Start
* [Install Go Buffalo](http://gobuffalo.io/docs/installation)
    1. Using `yarn` (over `npm`)
    2. Can use something like `asdf` for localized golang environments.  But using `go` on GO_PATH is probably the easiest

* create `.env` (see `.env.example`)
* run `buffalo dev` (once buffalo is on path)
* go to [http://localhost:3000](http://localhost:3000)

## Basic Idea

There are a few different kinds of routes:

* "/" - home page - no data (now)
* "/pages/{type}" will 
    * run a template in `templates/any_pages/{type}.html` 
    * with (optionally) data from `templates/any_pages/{type}.graphql`
* "/search/{type}" will
    * run a template in `templates/search_pages/{type}.html` 

* "/lists/{type}" - (NOTE: will probably drop this one)
    * run a template in `templates/list_pages/{type}.html` 
    * with (required) data from `templates/list_pages/{type}.graphql`
    * will send a `pageNumber` parameter

* "/entities/{type}/{id}" - will
    * run a template in `templates/entity_pages/{type}.html` 
    * with (required) data from `templates/entity_pages/{type}.graphql`
    * send in the `id` as a parameter to the quer

## Philosophy

It should be easy to add new pages, it should be clear what data is going to that page, and it should be easy to change what that data is

Searches, or other complex UIs, are better done with client side code (over trying to make it all server-side)

It would be good if an organization could have `widgets` or `components` to display data from this
site in their own site. So starting off we are emphasizing `webcomponents`

This is just one possible implementation of making a front-end to a GraphQL based api based on Vivo data.  Although this site should be mobile-friendly, a more dedicated mobile client using the GraphQL Api directly
and in more targeted ways is more likely



