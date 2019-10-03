package actions

import "github.com/gobuffalo/buffalo"

func DocPageHandler(c buffalo.Context) error {
	return c.Render(200, r.HTML("element_doc_pages/index.html", "docs.html"))
}
