package actions

import (
	"github.com/OIT-ADS-Web/vivo-scholar/helpers"
	"github.com/gobuffalo/buffalo/render"
	"github.com/gobuffalo/packr/v2"
)

var r *render.Engine
var assetsBox = packr.New("app:assets", "../public")

func init() {
	r = render.New(render.Options{
		// HTML layout to be used for all HTML requests:
		HTMLLayout: "application.html",

		// Box containing all of the templates:
		TemplatesBox: packr.New("app:templates", "../templates"),
		AssetsBox:    assetsBox,

		// Add template helpers here:
		Helpers: render.Helpers{
			"FormatDateTime": helpers.FormatDateTime,
			"FloatToInt": helpers.FloatToInt,
			// TODO: not sure about this
			"FigurePagingInfo": helpers.FigurePagingInfo,
			"HasKey": helpers.HasKey,
			// uncomment for non-Bootstrap form helpers:
			// "form":     plush.FormHelper,
			// "form_for": plush.FormForHelper,
		},
	})
}
