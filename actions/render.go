package actions

import (
	"github.com/OIT-ADS-Web/vivo-scholar/helpers"
	"github.com/gobuffalo/buffalo/render"
	"github.com/gobuffalo/packr/v2"
)

var r *render.Engine
var assetsBox = packr.New("app:assets", "../public")

// NOTE: same as templates
var graphqlBox = packr.New("app:gql", "../templates")

// https://gobuffalo.io/en/docs/template-engines
/*
    TemplateEngines: map[string]render.TemplateEngine{
      ".tmpl": GoTemplateEngine,
	},

*/
func init() {
	r = render.New(render.Options{
		// HTML layout to be used for all HTML requests:
		HTMLLayout: "application.html",

		// Box containing all of the templates:
		TemplatesBox: packr.New("app:templates", "../templates"),
		AssetsBox:    assetsBox,

		// Add template helpers here:
		Helpers: render.Helpers{
			"FormatDateTime":    helpers.FormatDateTime,
			"FormatISODate":     helpers.FormatISODate,
			"FormatGraphqlDate": helpers.FormatGraphqlDate,
			"FloatToInt":        helpers.FloatToInt,
			// TODO: not sure about this
			"FigurePagingInfo":           helpers.FigurePagingInfo,
			"HasKey":                     helpers.HasKey,
			"RemoveLanguageTag":          helpers.RemoveLanguageTag,
			"MakeJSONString":             helpers.MakeJSONString,
			"ThemeVariable":              helpers.ThemeVariable,
			"Trim":                       helpers.Trim,
			"SortByStringField":          helpers.SortByStringField,
			"SortByStringFieldDesc":      helpers.SortByStringFieldDesc,
			"SortByISODateField":         helpers.SortByISODateField,
			"SortByISODateFieldDesc":     helpers.SortByISODateFieldDesc,
			"SortByGraphqlDateField":     helpers.SortByGraphqlDateField,
			"SortByGraphqlDateFieldDesc": helpers.SortByGraphqlDateFieldDesc,
			"SplitCamelCase":							helpers.SplitCamelCase,
		},
	})
}
