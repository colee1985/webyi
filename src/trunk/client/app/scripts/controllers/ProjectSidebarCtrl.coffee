# 侧栏菜单控制
ag.controller 'ProjectSidebarCtrl', ['AppConfig', '$scope', 'SocketConnect', 'Logger', 'Schema', 'Requrl', 'Action', 'CodeFile', 
(app, $scope, socket, Logger, Schema, Requrl, Action, CodeFile)->
	$scope.app = app

	$scope.Action = Action
	$scope.Schema = Schema
	$scope.Requrl = Requrl
	$scope.CodeFile = CodeFile
	Q.all [Schema.getList(), Requrl.getList(), Action.getList(), CodeFile.getList()]
	.then (res)->
		$scope.$apply()

	$scope.del = (models_name, model, index)->
		if models_name=='schema'
			Schema.del model._id
			$scope.schemas.splice index,1
		else if models_name=='requrl'
			Requrl.del model._id
			$scope.requrls.splice index,1
		else if models_name=='action'
			Action.del model._id
			$scope.actions.splice index,1
		else if models_name=='view'
			CodeFile.del model._id
			$scope.actions.splice index,1
		else
			console.log '无效删除操作'
	$scope.generateAppItem = ->
		app.getCurAppItemId()
		.then (id)->
			socket.emit 'GenerateAppItem', id
		.done()
		return true
	$scope.runAppItem = ->
		app.getCurAppItemId()
		.then (id)->
			socket.emit 'RunAppItem', id
		.done()
		return true
		
	$scope.loggerShow = ->
		Logger.show()
]