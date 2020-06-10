package actions

import (
	"fmt"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	forcessl "github.com/gobuffalo/mw-forcessl"
	paramlogger "github.com/gobuffalo/mw-paramlogger"
	"github.com/gorilla/mux"
	"github.com/unrolled/secure"

	csrf "github.com/gobuffalo/mw-csrf"
	i18n "github.com/gobuffalo/mw-i18n"
	"github.com/gobuffalo/packr/v2"

	"net/http"
	"net/http/httputil"
	"net/url"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App
var T *i18n.Translator

func graphqlProxy() http.Handler {
	baseURL, err := envy.MustGet("GRAPHQL_ENDPOINT_BASE")
	if err != nil {
		panic(err)
	}
	origin, _ := url.Parse(baseURL)
	reverseProxy := httputil.NewSingleHostReverseProxy(origin)
	reverseProxy.ErrorHandler = func(rw http.ResponseWriter, r *http.Request, err error) {
		fmt.Printf("error was: %+v", err)
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte(err.Error()))
	}

	mux := mux.NewRouter()
	mux.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Host = r.URL.Host
		reverseProxy.ServeHTTP(w, r)
	}).Methods("GET", "POST")
	return mux
}

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
//
// Routing, middleware, groups, etc... are declared TOP -> DOWN.
// This means if you add a middleware to `app` *after* declaring a
// group, that group will NOT have that new middleware. The same
// is true of resource declarations as well.
//
// It also means that routes are checked in the order they are declared.
// `ServeFiles` is a CATCH-ALL route, so it should always be
// placed last in the route declarations, as it will prevent routes
// declared after it to never be called.
func App() *buffalo.App {

	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:         ENV,
			SessionName: "_vivo_scholar_session",
		})

		// Automatically redirect to SSL
		app.Use(forceSSL())

		// Log request parameters (filters apply).
		app.Use(paramlogger.ParameterLogger)

		// Protect against CSRF attacks. https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
		// Remove to disable this.
		app.Use(csrf.New)

		// Setup and use translations:
		app.Use(translations())

		//app.Mount("/api/", mux)
		app.Mount("/api/", graphqlProxy())

		app.GET("/", HomeHandler)
		app.GET("/sitemap.xml", SiteMapHandler)
		app.GET("/sitemaps/{type}.xml", SiteMapPageHandler)
		app.GET("/pages/{name}", AnyPageHandler)
		app.GET("/search", SearchPageHandler)
		// even though {type} is not used, this makes
		// search/people, search/publications etc... possible
		app.GET("/search/{type}", SearchPageHandler)
		// TODO: should we even have list pages (since there is search)
		app.GET("/lists/{type}", ListPageHandler)
		app.GET("/entities/{type}/{id}", EntityPageHandler)
		app.GET("/entities/{type}/{id}/{tabName}", EntityPageHandler)
		app.GET("/docs", DocPageHandler)
		app.GET("/docs/elements/{element}", ElementDocPageHandler)

		app.ServeFiles("/", assetsBox) // serve files from the public directory
	}

	return app
}

// translations will load locale files, set up the translator `actions.T`,
// and will return a middleware to use to load the correct locale for each
// request.
// for more information: https://gobuffalo.io/en/docs/localization
func translations() buffalo.MiddlewareFunc {
	var err error
	if T, err = i18n.New(packr.New("app:locales", "../locales"), "en-US"); err != nil {
		app.Stop(err)
	}
	return T.Middleware()
}

// forceSSL will return a middleware that will redirect an incoming request
// if it is not HTTPS. "http://example.com" => "https://example.com".
// This middleware does **not** enable SSL. for your application. To do that
// we recommend using a proxy: https://gobuffalo.io/en/docs/proxy
// for more information: https://github.com/unrolled/secure/
func forceSSL() buffalo.MiddlewareFunc {
	return forcessl.Middleware(secure.Options{
		SSLRedirect:     ENV == "production",
		SSLProxyHeaders: map[string]string{"X-Forwarded-Proto": "https"},
	})
}
