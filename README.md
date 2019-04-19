# Vivo Scholar

Frontend POC exploring a server rendering web app that can also run the graphql
endpoint.

## Config

Before starting, you need to set the for your elastic search index as the
following environment variable.

```
$ export ELASTIC_URL=http://localhost:8888/
```

## Starting the Application

Buffalo ships with a command that will watch your application and automatically
rebuild the Go binary and any assets for you. To do that run the "buffalo dev"
command:

	$ buffalo dev

If you point your browser to [http://127.0.0.1:3000](http://127.0.0.1:3000) you
should see a "Welcome to Buffalo!" page.

**Congratulations!** You now have your Buffalo application up and running.

## What Next?

We recommend you heading over to [http://gobuffalo.io](http://gobuffalo.io) and
reviewing all of the great documentation there.

Good luck!

[Powered by Buffalo](http://gobuffalo.io)
