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
//<input type="text" name="Products[0].Name" value="Playstation 4">

type FilterField struct {
	Field string `form:"facetField"`
	Value string `form:"facetValue"`
}

type Search struct {
	PageNumber int `form:"pageNumber"`
	PageSize int `form:"pageSize"`
	Search string `form:"search"`
	//Filters map[string][]string `form:"filters"`

	//Filters []FilterField `form:"filters"`
	//Filters map[string][]FilterField `form:"filters"`
	//Filters map[string]interface{} `form:"filters"`
	//Filters []interface{} `form:"filters"`
	Filters map[string]map[string]bool `form:"filters"`

	// filters[0]["keywords"]["informatics"] = true
	// filters[1]["keywords"]["biostatistics"] = true
}

/*
Products   []struct {
    Name string
    Type string
  }


  in grapqhl file -->

    filters: [
      <%= for (k,v) in searchForm.Filters { %>
        <%= for (sel, x) in v { %>
         {field: "<%= k %>", value: "<%= sel %>"}
        <% } %>
      <% } %>
    ],  
*/
// EntityPageHandler - Use naming convention to load a template and
// corresponding graphql query. Execute the query and use results as
// the model for the template. File locations are:
// Template: entity_pages/{entityType}/{entityType}.html
// Query:    entity_pages/{entityType}/{entityType}.graphql
func SearchPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	// might not need this is binding (see below) works
	search := c.Params().Get("search")

	s := &Search{}
	if err := c.Bind(s); err != nil {
	  return err
	}
	fmt.Printf("s=%#v\n", s)
    
	viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", entityType, entityType)
	queryTemplatePath := fmt.Sprintf("templates/search_pages/%s/%s.graphql", entityType, entityType)

	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		return errors.Wrap(err, "reading query template")
	}

	ctx := plush.NewContext()
	ctx.Set("searchForm", s)
	// {"field": field, "value": value}
	filters := make([]map[string]string, 0)

	for k, v := range(s.Filters) {
		for k2, _ := range v {
			hash := map[string]string{"field": k, "value": k2}
			filters = append(filters, hash)
		}
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
		  if (len(v) == 1) {
			req.Var(k, v[0])
		  }
		  c.Set(k, v)
		}
	}

	// default page number
	req.Var("pageNumber", "0")

	pageNumber := c.Params().Get("pageNumber")
	if pageNumber != "" {
		req.Var("pageNumber", pageNumber)
	} 

	var results map[string]interface{}
	if err := client.Run(ctx, req, &results); err != nil {
		return errors.Wrap(err, "running graphql statement")
	}

	c.Set("data", results)
	c.Set("searchForm", s)
	return c.Render(200, r.HTML(viewTemplatePath))
}
