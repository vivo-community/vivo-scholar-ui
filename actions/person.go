package actions

import (
	"fmt"
	"log"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	vq "github.com/vivo-community/vivo-graphql"
)

// HomeHandler is a default handler to serve up
// a home page.
func PersonHandler(c buffalo.Context) error {
	schema := vq.MakeSchema()

	gql := `
{
  personList(filter: {limit: 100, offset: 0, query: ""}) {
    results {
      id
      name {
        firstName
        lastName
        middleName
      }
      affliationList {
        id
        label
        startDate {
          dateTime
          resolution
        }
      }
    }
  }
}
`
	results := vq.ExecuteQuery(gql, schema)

	template := `
	data: <%= inspect(data["personList"]["results"]) %>
	-----
	<%= for (value) in data["personList"]["results"] { %>
		<%= inspect(value) %><br/>
	<% } %>


	`
	ctx := plush.NewContext()
	ctx.Set("data", results.Data)

	s, err := plush.Render(template, ctx)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%+v\n", results.Data)
	return c.Render(200, r.String(s))
}
