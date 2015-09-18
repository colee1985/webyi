# <div plan-status="CodeFile.save(codefile)" ng-model="codefile.plan_status"></div>
ag.directive "planStatus", factory = ->
	priority: 100
	templateUrl: "templates/plan-status.html"
	replace: true
	# transclude: true
	restrict: "AE"
	require: '?ngModel'
	scope:
		save: "&planStatus"
	link: (scope, element, attrs, ctrl)->
		if ctrl
			ctrl.$render = ->
				scope.status = ctrl.$modelValue
			scope.setStatus = (item)->
				scope.status = item
				ctrl.$setViewValue item
				scope.save()