package actions

import (
	"fmt"
	"io"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/render"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
	"github.com/pkg/errors"
)

// this is effectivily a sitemap index
func SiteMapHandler(c buffalo.Context) error {
	viewTemplatePath := "sitemap_pages/sitemap.xml"
	viewTemplate, err := graphqlBox.FindString(viewTemplatePath)
	if err != nil {
		return errors.Wrap(err, "reading sitemap template")
	}
	ctx := plush.NewContext()
	v, err := envy.MustGet("SITE_URL")
	ctx.Set("siteUrl", v)
	xml, err := plush.Render(string(viewTemplate), ctx)

	renderer := func(w io.Writer, d render.Data) error {
		_, err = w.Write([]byte(xml))
		return err
	}
	return c.Render(200, r.Func("application/xml", renderer))
}

// NOTE: you can combine with above sitemap.xml template to make a full sitemap
// of all entity pages based on graphql query
//
// There is a hard limit to sitemaps of 50,000 - so this sets that as pageSize
// 
// If you have more than 50,000 you would have to split up the indexes in some
// way - either sending in page parameters from the base sitemap, or linking to 
// a series of filtered queries
func SiteMapPageHandler(c buffalo.Context) error {
	listType := c.Params().Get("type")
	viewTemplatePath := fmt.Sprintf("sitemap_pages/%s/%s.xml", listType, listType)
	queryTemplatePath := fmt.Sprintf("sitemap_pages/%s/%s.graphql", listType, listType)

	queryTemplate, err := graphqlBox.FindString(queryTemplatePath)
	if err != nil {
		return errors.Wrap(err, "reading query template")
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		return errors.Wrap(err, "running query template")
	}

	siteUrl, err := envy.MustGet("SITE_URL")
	if err != nil {
		return errors.Wrap(err, "finding SITE_URL env value")
	}
	endpoint := fmt.Sprintf("%s/api/graphql", siteUrl)
	client := graphql.NewClient(endpoint)

	req := graphql.NewRequest(query)

	req.Var("pageSize", "50000")
	req.Var("pageNumber", "0")

	pageNumber := c.Params().Get("pageNumber")
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

	viewTemplate, err := graphqlBox.FindString(viewTemplatePath)

	ctx2 := plush.NewContext()
	v, err := envy.MustGet("SITE_URL")
	if err != nil {
		return errors.Wrap(err, "getting SITE_URL environment variable")
	}
	ctx2.Set("siteUrl", v)
	ctx2.Set("data", results)

	xml, err := plush.Render(string(viewTemplate), ctx2)

	renderer := func(w io.Writer, d render.Data) error {
		_, err = w.Write([]byte(xml))
		return err
	}
	return c.Render(200, r.Func("application/xml", renderer))
}
