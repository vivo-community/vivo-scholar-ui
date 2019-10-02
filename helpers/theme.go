package helpers

import (
	"github.com/gobuffalo/envy"
)

var theme = map[string]string{
	"primaryColor":             envy.Get("PRIMARY_COLOR", "#2f3d4f"),
	"highlightColor":           envy.Get("HIGHLIGHT_COLOR", "#26a8df"),
	"highlightBackgroundColor": envy.Get("HIGHLIGHT_BACKGROUND_COLOR", "#9ac9de"),
	"secondaryHighlightColor":  envy.Get("SECONDARY_HIGHLIGHT_COLOR", "#73bf4a"),
	"linkColor":                envy.Get("LINK_COLOR", "#0577b1"),
	"textColor":                envy.Get("TEXT_COLOR", "#000000"),
	"darkNeutralColor":         envy.Get("DARK_NEUTRAL_COLOR", "#7f7f7f"),
	"mediumNeutralColor":       envy.Get("MEDIUM_NEUTRAL_COLOR", "#cbced3"),
	"lightNeutralColor":        envy.Get("LIGHT_NEUTRAL_COLOR", "#e2e6ed"),
}

func ThemeVariable(varname string) string {
	return theme[varname]
}
