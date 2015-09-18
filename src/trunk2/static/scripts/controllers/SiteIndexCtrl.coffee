
app.controller 'SiteIndexCtrl', ($scope, SocketConnect, $element, WindowInfo)->
	$scope.joinAppAndStart = ->
		SocketConnect.emit('joinAppAndStart', 'D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/')
	# 正在运行的项目列表
	SocketConnect.on "runingAppList", (data) ->
		$scope.$apply ->
			$scope.running_list = data
	# 测试用例列表
	SocketConnect.on "testList", (data) ->
		$scope.$apply ->
			$scope.test_list = data

	$scope.createSchemas = ->
		SocketConnect.emit('createSchemas', 'D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/')

	$scope.createModels = ->
		SocketConnect.emit('createModels', 'D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/')

	$scope.createRouters = ->
		SocketConnect.emit('createRouters', 'D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/')

	$scope.createModelTests = ->
		SocketConnect.emit('createModelTests', 'D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/')
	# 运行测试用例
	# params: {file:'test/models/a.test.js', grep: 'models.xxx'}
	$scope.runTest = (params)->
		SocketConnect.emit('runTest', 'D:/coleeFlie/htdocs/Co-sumaitong/src/trunk5/', params)
	