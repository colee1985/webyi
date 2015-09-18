# use:
# <form ng-submit="save()" method="post" on-ctrl-s="save()">

ag.directive "onCtrlS", ->
	priority: 100
	restrict: "AE"
	scope:
		onCtrlS: "&" #做为函数体执行
	link: (scope, element, attrs)->
		$(element).bind 'keydown', (e)->
			if(e.ctrlKey && e.keyCode == 83)
				console.log 'onCtrlS'
				scope.$apply ->
					scope.onCtrlS()
				e.preventDefault()