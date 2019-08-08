package actions

import (
	"fmt"
	"io/ioutil"
	"net/url"
	
	"github.com/pkg/errors"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
)

/*
way to bind search params to this ...
+plus limit of pageSize (select options)
    facets: [{field: "keywords"},
      {field: "researchAreas"},
      {field: "selectedPublicationVenue"},
      {field: "selectedPublicationPublisher"},
      {field: "positions"}
    ],
	
	filters: [],
    paging: { pageSize:100, pageNumber: $pageNumber,
        sort:{ 
          orders: [{direction: ASC, property:"name"}]
		}  
		//https://demos.library.tamu.edu/scholars-ui/discovery/People?collection=persons&facets=type,positionOrganization,researchAreas,selectedPublicationVenue,selectedPublicationPublisher,positions,keywords&sort=name,ASC&query=search&selectedPublicationVenue.filter=Optics%20InfoBase%20Conference%20Papers&page=1

*/

/*
type FilterField struct {
	Field string `form:"facetField"`
	Value string `form:"facetValue"`
}
*/

type Search struct {
	PageNumber int `form:"pageNumber"`
	//PageSize int `form:"pageSize"`
	Search string `form:"search"`
	//Filters map[string][]string `form:"filters"`
	Filters map[string]map[string]bool `form:"filters"`
	// filters[0]["keywords"]["informatics"] = true
	// filters[1]["keywords"]["biostatistics"] = true
}

/*
formam:
  <input type="text" name="Products[0].Name" value="Playstation 4">
  <input type="text" name="Products[0].Type" value="Video games">

*/

//
//{\"filters[0][field]\":[\"keywords\"],
// \"filters[0][value]\":[\"management\"],
// \"filters[1][field]\":[\"keywords\"],
// \"filters[1][value]\":[\"Data\"],
// \"pageNumber\":[\"0\"],
// \"search\":[\"*\"],\"type\":[\"people\"]}"

func SearchApiHandler(c buffalo.Context) error {
  entityType := c.Params().Get("type")
  // might not need this is binding (see below) works
  search := c.Params().Get("search")
  
  s := &Search{}
  // NOTE: bind error when called via xhr ...
  //if err := c.Bind(s); err != nil {
  // return errors.Wrap(err, "binding to search form")
  //}
  s.Search = c.Params().Get("search")
  //s.Filters = c.Params().Get("filters")

  //fmt.Printf("s=%#v\n", s)
  queryTemplatePath := fmt.Sprintf("templates/search_pages/%s/%s.graphql", entityType, entityType)
  queryTemplate, err := ioutil.ReadFile(queryTemplatePath)

  ctx := plush.NewContext()
  filters := make([]map[string]string, 0)

  // might have to get them like this:
  //filters[0][field]=keywords&filters[0][value]=management

  // how to get filters from xhr??? - maybe
  // just c.Params().Get("filter")-->
  for k, v := range(s.Filters) {
	  fmt.Printf("filters:key=%#v,value=%#v\n", k, v)
	  /* 
	  for k2, _ := range v {
		  hash := map[string]string{"field": k, "value": k2}
		  //filters = append(filters, hash)
	  }
	  */
  }
  fmt.Printf("filters=%v#\n", filters)

  query, err := plush.Render(string(queryTemplate), ctx)
  if err != nil {
	  return errors.Wrap(err, "process query template")
  }

  fmt.Printf("query=%s\n", query)
  endpoint, err := envy.MustGet("GRAPHQL_ENDPOINT")
  if err != nil {
	  return errors.Wrap(err, "setting graphql endpoint")
  }
  client := graphql.NewClient(endpoint)

  // need tp try and set filters ...
  //filters: [],

  req := graphql.NewRequest(query)
  req.Var("search", search)
  req.Var("filters", filters)

  // send in all params (sort of)
  if m, ok := c.Params().(url.Values); ok {
	for k, v := range m {
	  // what about 'filters'
	  if (len(v) == 1) {
		req.Var(k, v[0])
	  }
	  c.Set(k, v)
	}
  }

  pageNumber := c.Params().Get("pageNumber")
  if pageNumber != "" {
	  req.Var("pageNumber", pageNumber)
  } else {
    // default page number
    req.Var("pageNumber", "0") 
  }

  var results map[string]interface{}
  if err := client.Run(ctx, req, &results); err != nil {
	return errors.Wrap(err, "running graphql statement")
  }

  c.Set("data", results)
  //fmt.Printf("trying to return %#v\n", results)
  return c.Render(200, r.JSON(results))
}

// EntityPageHandler - Use naming convention to load a template and
// corresponding graphql query. Execute the query and use results as
// the model for the template. File locations are:
// Template: entity_pages/{entityType}/{entityType}.html
// Query:    entity_pages/{entityType}/{entityType}.graphql
func SearchPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", entityType, entityType)	
	// FIXME: send in javascript asset vue application
	// as variable e.g. <%= javascriptTag("%type.js") %>
	c.Set("type", entityType)

	return c.Render(200, r.HTML(viewTemplatePath))

	/*
	queryTemplatePath := fmt.Sprintf("templates/search_pages/%s/%s.graphql", entityType, entityType)
	// jsPath =  fmt.Sprintf("templates/search_pages/%s/%s.js", entityType, entityType)
	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		return errors.Wrap(err, "reading query template")
	}
	
	ctx := plush.NewContext()
	filters := make([]map[string]string, 0)

	for k, v := range(s.Filters) {
		for k2, _ := range v {
			hash := map[string]string{"field": k, "value": k2}
			filters = append(filters, hash)
		}
	}
	fmt.Printf("filters=%v#\n", filters)

	// does this need to be a template?
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		return errors.Wrap(err, "process query template")
	}

	fmt.Printf("query=%s\n", query)
	endpoint, err := envy.MustGet("GRAPHQL_ENDPOINT")
	if err != nil {
		return errors.Wrap(err, "setting graphql endpoint")
	}
	client := graphql.NewClient(endpoint)

	// need tp try and set filters ...
	//filters: [],

	req := graphql.NewRequest(query)
	req.Var("search", search)
	req.Var("filters", filters)
	
	// send in all params (sort of)
	if m, ok := c.Params().(url.Values); ok {
		for k, v := range m {
		  // what about 'filters'
		  if (len(v) == 1) {
			req.Var(k, v[0])
		  }
		  c.Set(k, v)
		}
	}

	pageNumber := c.Params().Get("pageNumber")
	if pageNumber != "" {
		req.Var("pageNumber", pageNumber)
	} else {
	  // default page number
	  req.Var("pageNumber", "0")
	}

	var results map[string]interface{}
	if err := client.Run(ctx, req, &results); err != nil {
		return errors.Wrap(err, "running graphql statement")
	}

	c.Set("data", results)
	c.Set("searchForm", s)
    */
}
