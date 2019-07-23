package actions

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	//"net/url"
	//"strconv"

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
		log.Fatal(err)
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		log.Fatal(err)
	}

	client := graphql.NewClient("http://localhost:9000/graphql")
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
		log.Fatal(err)
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
