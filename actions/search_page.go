package actions

import (
	"github.com/gobuffalo/buffalo"
)

// SearchPageHandler - just one page?
func SearchPageHandler(c buffalo.Context) error {
	viewTemplatePath := "search_pages/index.html"
	return c.Render(200, r.HTML(viewTemplatePath, "search.html"))
}
