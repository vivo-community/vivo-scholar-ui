package actions

import (
	"fmt"

	"github.com/gobuffalo/buffalo"
)

// ElementDocPageHandler serves documentation and examples
// for the specified custom element
func ElementDocPageHandler(c buffalo.Context) error {
	element := c.Params().Get("element")
	return c.Render(200, r.HTML(fmt.Sprintf("element_doc_pages/%s.html", element)))
}
