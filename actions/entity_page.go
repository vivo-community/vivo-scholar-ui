package actions

import (
	"fmt"
	"io/ioutil"
	"log"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	vq "github.com/vivo-community/vivo-graphql"
)

func EntityPageHandler(c buffalo.Context) error {
	entity_type := c.Params().Get("type")
	entity_id := c.Params().Get("id")
	view_template_path := fmt.Sprintf("entity_pages/%s/%s.html", entity_type, entity_type)
	query_template_path := fmt.Sprintf("templates/entity_pages/%s/%s.graphql", entity_type, entity_type)

	query_template, err := ioutil.ReadFile(query_template_path)
	if err != nil {
		log.Fatal(err)
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(query_template), ctx)
	if err != nil {
		log.Fatal(err)
	}

	schema := vq.MakeSchema()
	variables := map[string]interface{}{
		"id": entity_id,
	}
	results := vq.ExecuteQueryWithParams(query, schema, variables)
	log.Print(results)

	c.Set("data", results.Data)

	return c.Render(200, r.HTML(view_template_path))
}
