package actions

import (
	"fmt"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
	"github.com/pkg/errors"
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
	queryTemplatePath := fmt.Sprintf("entity_pages/%s/%s.graphql", entityType, entityType)

	queryTemplate, err := graphqlBox.FindString(queryTemplatePath)

	if err != nil {
		return errors.Wrap(err, "finding query")
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		return errors.Wrap(err, "processing query")
	}

	siteUrl, err := envy.MustGet("SITE_URL")
	if err != nil {
		return errors.Wrap(err, "finding SITE_URL env value")
	}
	endpoint := fmt.Sprintf("%s/api/graphql", siteUrl)
	client := graphql.NewClient(endpoint)
	req := graphql.NewRequest(query)
	req.Var("id", entityID)

	var results map[string]interface{}
	if err := client.Run(ctx, req, &results); err != nil {
		return errors.Wrap(err, "running query")

	}
	c.Set("data", results)
	return c.Render(200, r.HTML(viewTemplatePath))
}
