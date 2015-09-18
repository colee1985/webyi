
app.config ($stateProvider, $urlRouterProvider) ->
	$stateProvider.state("site",
		url: "/site"
		views:
			container:
				templateUrl: "templates/site/layout.html"
	).state("site.index",
		url: "/index"
		views:
			container:
				templateUrl: "templates/site/index.html"
	)