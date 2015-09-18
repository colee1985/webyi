app.factory 'WindowInfo', ($rootScope)->
	ths = @
	ths.height = $(window).height()
	ths.width = $(window).width()
	$(window).resize ->
		$rootScope.$apply ->
			ths.height = $(@).height()
			ths.width = $(@).width()
	ths