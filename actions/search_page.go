package actions

import (
	//"fmt"

	"github.com/gobuffalo/buffalo"
)

// SearchPageHandler - Use naming convention to load a template
// Template: entity_pages/{entityType}/{entityType}.html
func SearchPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	viewTemplatePath := "search_pages/index.html"
	//viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", entityType, entityType)
	// FIXME: send in javascript asset vue application
	// as variable e.g. <%= javascriptTag("%type.js") %>
	c.Set("type", entityType)

	return c.Render(200, r.HTML(viewTemplatePath, "search.html"))

	// NOTE: these will be javascript driven
	//return c.Render(200, r.HTML(viewTemplatePath))
}
