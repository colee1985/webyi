# use:

ag.directive "coOnDrag", ['$document', ($document)->
	priority: 100
	# templateUrl: "templates/dialog.html"
	# replace: true
	# transclude: true
	restrict: "EA"
	scope:
		onMove: "=coOnDrag" #引用dialog标签title属性的值
		initX: '@'
		initY: '@'
	link: (scope, element, attrs)->
		x = scope.initX || 0
		y = scope.initY || 0
		startY = 0
		startX = 0
		mousemove = (event) ->
			# event.preventDefault()
			y = event.screenY - startY
			x = event.screenX - startX
			scope.onMove x, y

		mouseup = ->
			$document.unbind "mousemove", mousemove
			$document.unbind "mouseup", mouseup

		element.on "mousedown", (event) ->
			event.preventDefault()
			startX = event.screenX - x
			startY = event.screenY - y
			$document.on "mousemove", mousemove
			$document.on "mouseup", mouseup
]