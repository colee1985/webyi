
app.config ($stateProvider, $urlRouterProvider) ->
	$stateProvider.state("schema",
		url: "/schema"
		views:
			container:
				templateUrl: "templates/schemas/layout.html"
	).state("schema.index",
		url: "/index"
		views:
			container:
				templateUrl: "templates/schemas/schema-form.html"
	)