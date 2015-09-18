
# 侧栏菜单控制
ag.controller 'AppItemSidebarCtrl', ['AppConfig', '$scope', '$state', 'AppItem', (app, $scope, $state, AppItem)->
	$scope.app = app

	$scope.AppItem = AppItem
	Q.fcall ->
		AppItem.getList()
	.then (res)->
		$scope.$apply()

	$scope.del = (model, index)->
		AppItem.del model._id
		$scope.appitems.splice index,1

	$scope.intoProject = (app_item_id)->
		window.localStorage.app_item_id = app_item_id
		$state.go 'schema.create'
]