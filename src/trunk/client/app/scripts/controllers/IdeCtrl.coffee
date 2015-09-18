# 编辑器模式控制器
ag.controller 'IdeCtrl', ['AppConfig', '$scope', 'FileModel', 
(app, $scope, FileModel)->
	$scope.app = app
	app.active = 'ide'

	$scope.FileModel = FileModel
	# 激活标签
	$scope.activeTab = (item)->
		FileModel.active_tab = item.path
		FileModel.showInEdit item
]