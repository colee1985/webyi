# 编辑器模式侧栏控制器
ag.controller 'IdeSidebarCtrl', ['AppConfig', '$scope', 'FileModel', 'AppItem',
(app, $scope, FileModel, AppItem)->
	$scope.app = app
	app.active = 'ide'

	app.getCurAppItemId()
	.then (app_item_id)->
		AppItem.findById app_item_id
	.then (app_item_doc)->
		$scope.$apply ->
			$scope.item = {
				path: app_item_doc.directory
				name: app_item_doc.name
				type: 'folder'
			}

	$scope.getChilds = (item)->
		if item.type=='folder'
			if !item.childs
				FileModel.findByDir item.path+'/'
				.then (data)->
					$scope.$apply ->
						item.childs = data
			else
				item.childs = null

	$scope.edit = (item)->
		if item.type=='file'
			FileModel.addSelect item
]