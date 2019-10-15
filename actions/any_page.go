package actions

import (
	"fmt"
	"io/ioutil"
	"net/url"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
	"github.com/pkg/errors"
)

// AnyPageHandler - Use naming convention to load a template and
// (optional) corresponding graphql query.
// Execute the query and use results as
// the model for the template. File locations are:
// Template: any_pages/{Type}.html
// Query:    any_pages/{Type}.graphql
func AnyPageHandler(c buffalo.Context) error {
	pageName := c.Params().Get("name")
	viewTemplatePath := fmt.Sprintf("any_pages/%s.html", pageName)
	queryTemplatePath := fmt.Sprintf("templates/any_pages/%s.graphql", pageName)

	queryExists := true
	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		queryExists = false
	}

	// if there is a query run it - but it's okay to not have one
	// (unlike entity pages)
	if queryExists {
		ctx := plush.NewContext()
		endpoint, err := envy.MustGet("GRAPHQL_ENDPOINT")
		if err != nil {
			return errors.Wrap(err, "finding endpoint")
		}
		client := graphql.NewClient(endpoint)

		query, err := plush.Render(string(queryTemplate), ctx)
		if err != nil {
			return errors.Wrap(err, "rendering query template")
		}

		req := graphql.NewRequest(query)
		if m, ok := c.Params().(url.Values); ok {
			for k, v := range m {
				if len(v) == 1 {
					// I don't know how GraphQL handles array parameters
					req.Var(k, v[0])
				}
			}
		}
		var results map[string]interface{}
		if err := client.Run(ctx, req, &results); err != nil {
			return errors.Wrap(err, "running query template")
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
