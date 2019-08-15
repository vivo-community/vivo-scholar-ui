package actions

import (
	"fmt"
	
	"github.com/gobuffalo/buffalo"
)

// SearchPageHandler - Use naming convention to load a template
// Template: entity_pages/{entityType}/{entityType}.html
func SearchPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", entityType, entityType)	
	// FIXME: send in javascript asset vue application
	// as variable e.g. <%= javascriptTag("%type.js") %>
	c.Set("type", entityType)

	// NOTE: these will be javascript driven
	return c.Render(200, r.HTML(viewTemplatePath))
}
