package actions

import (
	"fmt"
	"io/ioutil"
	"io"

	"github.com/pkg/errors"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/render"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
)

func SiteMapHandler(c buffalo.Context) error {
	viewTemplatePath := "templates/sitemap_pages/sitemap.xml"
	viewTemplate, err := ioutil.ReadFile(viewTemplatePath)

	ctx := plush.NewContext()
	xml, err := plush.Render(string(viewTemplate), ctx)

	renderer := func(w io.Writer, d render.Data) error {
		_, err = w.Write([]byte(xml))
		return err
	}
	// not sending data in
	return c.Render(200, r.Func("application/xml", renderer))
}

// TODO: still have to work out details
// the general idea is you can combine this with the 
// above sitemap.xml template to make a full sitemap
// of all entity pages (you want)
// including being able to limit to 50,000 (limit of
// size of any particular sitemap file)
func SiteMapPageHandler(c buffalo.Context) error {
	listType := c.Params().Get("type")
	// different view template based on content-type??
	extension := TemplateExtension(c.Request())
	fmt.Printf("extension=%s\n", extension)
	// might be good to index by beginning letter, or pub date filter
	// or something like that ???
	viewTemplatePath := fmt.Sprintf("sitemap_pages/%s/%s.xml", listType, listType)
	queryTemplatePath := fmt.Sprintf("templates/sitemap_pages/%s/%s.graphql", listType, listType)

	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		return errors.Wrap(err, "reading query template")
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		return errors.Wrap(err, "running query template")
	}

	endpoint, err := envy.MustGet("GRAPHQL_ENDPOINT")
	if err != nil {
		return errors.Wrap(err, "finding endpoint")
	}
	client := graphql.NewClient(endpoint)

	req := graphql.NewRequest(query)
	
	// how to determine defaults? query itself should also
	// be taking nulls and have defaults too
	req.Var("pageSize", "100")
	req.Var("pageNumber", "0")

	pageNumber := c.Params().Get("pageNumber")
	// check null or "" ??
	if pageNumber != "" {
		req.Var("pageNumber", pageNumber)
	} 
	pageSize := c.Params().Get("pageSize")
	if pageSize != "" {
		req.Var("pageSize", pageSize)
	} 

	var results map[string]interface{}

	if err := client.Run(ctx, req, &results); err != nil {
		return errors.Wrap(err, "running query")
	}
	
	c.Set("data", results)

	// this does not work
	return c.Render(200, r.XML(viewTemplatePath))
}
