package helpers

import (
	"github.com/gobuffalo/envy"
)

var theme = map[string]string{
	"primaryColor":             envy.Get("THEME_PRIMARY_COLOR", "#2f3d4f"),
	"highlightColor":           envy.Get("THEME_HIGHLIGHT_COLOR", "#26a8df"),
	"highlightBackgroundColor": envy.Get("THEME_HIGHLIGHT_BACKGROUND_COLOR", "#9ac9de"),
	"secondaryHighlightColor":  envy.Get("THEME_SECONDARY_HIGHLIGHT_COLOR", "#73bf4a"),
	"linkColor":                envy.Get("THEME_LINK_COLOR", "#0577b1"),
	"textColor":                envy.Get("THEME_TEXT_COLOR", "#000000"),
	"darkNeutralColor":         envy.Get("THEME_DARK_NEUTRAL_COLOR", "#7f7f7f"),
	"mediumNeutralColor":       envy.Get("THEME_MEDIUM_NEUTRAL_COLOR", "#cbced3"),
	"lightNeutralColor":        envy.Get("THEME_LIGHT_NEUTRAL_COLOR", "#e2e6ed"),
	"backgroundImage":          envy.Get("THEME_BACKGROUND_IMAGE", "background.jpg"),
	"backgroundColor":          envy.Get("THEME_BACKGROUND_COLOR", "#7f7f7f"),
	"baseImageUrl":             envy.Get("BASE_IMAGE_URL", ""),
	"defaultProfileImage":      envy.Get("DEFAULT_PROFILE_IMAGE", ""),
	"siteOrganizationId":      envy.Get("SITE_ORGANIZATION_ID",  ""),
}

func ThemeVariable(varname string) string {
	return theme[varname]
}
