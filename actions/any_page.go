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
// Template: any_pages/{Type}.html
// Query:    any_pages/{Type}.graphql
func AnyPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	viewTemplatePath := fmt.Sprintf("any_pages/%s.html", entityType)
	queryTemplatePath := fmt.Sprintf("templates/any_pages/%s.graphql", entityType)

	queryExists := true
	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		queryExists = false
	}

	if (queryExists) {
		ctx := plush.NewContext()
		client := graphql.NewClient("http://localhost:9000/graphql")

		query, err := plush.Render(string(queryTemplate), ctx)
		if err != nil {
			log.Fatal(err)
		}
		
		req := graphql.NewRequest(query)
		if m, ok := c.Params().(url.Values); ok {
			for k, v := range m {
			  if (len(v) == 1) {
				// I don't know how GraphQL handles array parameters
				req.Var(k, v[0])
			  }
			}
		}
		var results map[string]interface{}
		if err := client.Run(ctx, req, &results); err != nil {
			log.Fatal(err)
		}
		c.Set("data", results)	
	}

	// NOTE: slightly ineffecient to iterate twice 
	if m, ok := c.Params().(url.Values); ok {
		for k, v := range m {
		  c.Set(k, v)
		}
	}

	return c.Render(200, r.HTML(viewTemplatePath))
}
