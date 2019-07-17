package actions

import (
	"fmt"
	"io/ioutil"
	"log"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
)

// EntityPageHandler - Use naming convention to load a template and
// corresponding graphql query. Execute the query and use results as
// the model for the template. File locations are:
// Template: entity_pages/{entityType}/{entityType}.html
// Query:    entity_pages/{entityType}/{entityType}.graphql
func EntityPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	entityID := c.Params().Get("id")
	viewTemplatePath := fmt.Sprintf("entity_pages/%s/%s.html", entityType, entityType)
	queryTemplatePath := fmt.Sprintf("templates/entity_pages/%s/%s.graphql", entityType, entityType)

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
	req.Var("id", entityID)

	var results map[string]interface{}
	if err := client.Run(ctx, req, &results); err != nil {
		log.Fatal(err)
	}
	c.Set("data", results)
	return c.Render(200, r.HTML(viewTemplatePath))
}
