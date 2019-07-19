package actions

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/url"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
)

// EntityPageHandler - Use naming convention to load a template and
// corresponding graphql query. Execute the query and use results as
// the model for the template. File locations are:
// Template: entity_pages/{entityType}/{entityType}.html
// Query:    entity_pages/{entityType}/{entityType}.graphql
func SearchPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	search := c.Params().Get("search")
	viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", entityType, entityType)
	queryTemplatePath := fmt.Sprintf("templates/search_pages/%s/%s.graphql", entityType, entityType)

	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		log.Fatal(err)
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		log.Fatal(err)
	}

	client := graphql.NewClient("http://localhost:9000/graphql")
	req := graphql.NewRequest(query)
	req.Var("search", search)
	
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
		log.Fatal(err)
	}

	
	c.Set("data", results)
	return c.Render(200, r.HTML(viewTemplatePath))
}
