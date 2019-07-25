package actions

import (
	"fmt"
	"io/ioutil"
	"net/url"
	
	"github.com/pkg/errors"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/plush"
	"github.com/machinebox/graphql"
)

/*
way to bind search params to this ...
+plus limit of pageSize (select options)
    facets: [{field: "keywords"},
      {field: "researchAreas"},
      {field: "selectedPublicationVenue"},
      {field: "selectedPublicationPublisher"},
      {field: "positions"}
    ],
	
	filters: [],
    paging: { pageSize:100, pageNumber: $pageNumber,
        sort:{ 
          orders: [{direction: ASC, property:"name"}]
		}  
		//https://demos.library.tamu.edu/scholars-ui/discovery/People?collection=persons&facets=type,positionOrganization,researchAreas,selectedPublicationVenue,selectedPublicationPublisher,positions,keywords&sort=name,ASC&query=search&selectedPublicationVenue.filter=Optics%20InfoBase%20Conference%20Papers&page=1

*/
type Search struct {
	PageNumber int
	PageSize int
	Search string
	Type string
}
/*
use 'bind' mechanism?

func (s *Search) Paths() (templatePath, queryPath) {
	viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", s.Type, s.Type)
	queryTemplatePath := fmt.Sprintf("templates/search_pages/%s/%s.graphql", s.Type, s.Type)
}

func NewSearch(c buffalo.Context) Search {
   s := &Search{PageNumber: 0, PageSize: 100}
   s.Type = c.Params().Get("type")
   s.Search = c.Params().Get("search")
   if val, ok := c.Params()["pageNumber"]; ok {
     s.PageNumber := c.Params().Get("pageNumber")
   }
}
*/
// EntityPageHandler - Use naming convention to load a template and
// corresponding graphql query. Execute the query and use results as
// the model for the template. File locations are:
// Template: entity_pages/{entityType}/{entityType}.html
// Query:    entity_pages/{entityType}/{entityType}.graphql
func SearchPageHandler(c buffalo.Context) error {
	entityType := c.Params().Get("type")
	search := c.Params().Get("search")

	viewTemplatePath := fmt.Sprintf("search_pages/%s/%s.html", entityType, entityType)
	queryTemplatePath := fmt.Sprintf("templates/search_pages/%s/%s.graphql", entityType, entityType)

	queryTemplate, err := ioutil.ReadFile(queryTemplatePath)
	if err != nil {
		return errors.Wrap(err, "reading query template")
	}

	ctx := plush.NewContext()
	query, err := plush.Render(string(queryTemplate), ctx)
	if err != nil {
		return errors.Wrap(err, "process query template")
	}

	endpoint, err := envy.MustGet("GRAPHQL_ENDPOINT")
	if err != nil {
		return errors.Wrap(err, "setting graphql endpoint")
	}
	client := graphql.NewClient(endpoint)

	req := graphql.NewRequest(query)
	req.Var("search", search)
	
	// send in all params (sort of)
	if m, ok := c.Params().(url.Values); ok {
		for k, v := range m {
		  if (len(v) == 1) {
			req.Var(k, v[0])
		  }
		  c.Set(k, v)
		}
	}

	// default page number
	req.Var("pageNumber", "0")

	pageNumber := c.Params().Get("pageNumber")
	if pageNumber != "" {
		req.Var("pageNumber", pageNumber)
	} 

	var results map[string]interface{}
	if err := client.Run(ctx, req, &results); err != nil {
		return errors.Wrap(err, "running graphql statement")
	}

	c.Set("data", results)
	return c.Render(200, r.HTML(viewTemplatePath))
}
