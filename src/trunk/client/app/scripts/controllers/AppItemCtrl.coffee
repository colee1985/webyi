# 配置信息设置控制器
ag.controller 'AppItemCtrl', ['AppConfig', '$scope', 'AppItem', '$state', '$stateParams', 'SocketConnect', 
(app, $scope, AppItem, $state, $stateParams, socket)->
	$scope.app = app
	app.active = 'appitem'
	$scope.config = do ->
		debug: true
	if $state.is 'appitem.create'
		$scope.model = AppItem.create()
	else if $state.is 'appitem.update'
		AppItem.findById $stateParams._id
		.then (data)->
			$scope.$apply ->
				$scope.model = data
	else
		$scope.model = AppItem.create()
	$scope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams)->
		# console.log toState.name
		$state.reload()

	$scope.save = ()->
		AppItem.save $scope.model
		.then (res)->
			$state.go 'appitem.update',
				_id: res._id
			return res
		.then (doc)->
			socket.emit 'GenerateConfig', doc
		.fail (err)->
			console.log err
		.done()
]