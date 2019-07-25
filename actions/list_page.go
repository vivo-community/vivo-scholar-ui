package actions

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
)

func TemplateExtension(request *http.Request) string {
	contentType := request.Header.Get("Content-type")
	if (contentType == "application/json") {
		return "json"
	} else {
		return "html"
	}
}
// ListPageHandler - Use naming convention to load a template and
// corresponding graphql query. Execute the query and use results as
// the model for the template. File locations are:
// Template: list_pages/{listType}/{listType}.html
// Query:    list_pages/{listType}/{listType}.graphql
func ListPageHandler(c buffalo.Context) error {
	listType := c.Params().Get("type")
	// different view template based on content-type??
	extension := TemplateExtension(c.Request())
	fmt.Println("extension=%s\n", extension)
	viewTemplatePath := fmt.Sprintf("list_pages/%s/%s.html", listType, listType)
	queryTemplatePath := fmt.Sprintf("templates/list_pages/%s/%s.graphql", listType, listType)

	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		log.Print(err)
		msg := fmt.Sprintf("error running query:%s", err)
		return c.Render(500, r.String(msg))
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		log.Print(err)
		msg := fmt.Sprintf("error running template:%s", err)
		return c.Render(500, r.String(msg))
	}

	endpoint, err := envy.MustGet("GRAPHQL_ENDPOINT")
	if err != nil {
		log.Print(err)
		msg := fmt.Sprintf("endpoint not set or readable %s", err)
		return c.Render(500, r.String(msg))
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
		log.Print(err)
		msg := fmt.Sprintf("error running query:%s", err)
		return c.Render(500, r.String(msg))
	}
	
	c.Set("data", results)
	// how to change content type returned?
	//contentType := c.request.Header.Get("Content-type")
	//if (contentType == "application/json" {
	//	return c.Render(200, r.JSON(results))
	// or ...
	// 	viewTemplatePath := fmt.Sprintf("list_pages/%s/%s.json", listType, listType)
	//}
	//
	return c.Render(200, r.HTML(viewTemplatePath))
}
