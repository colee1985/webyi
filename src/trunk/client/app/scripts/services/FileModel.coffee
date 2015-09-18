# 文件模型服务
ag.factory 'FileModel', ['AppConfig', 'toast', 'GlobalLoading', '$rootScope', (app, toast, GlobalLoading, $scope)->
	code_types:
		coffee: 'coffee'
		js: 'javascript'
		html: 'html'
		css: 'css'
		styl: 'stylus'
		less: 'less'
	findByDir: (dir)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'GET'
			url: app.api_domain+'file/findByDir'
			data:
				dir: dir
				time: (new Date()).getTime()
			dataType: 'JSON'
			success: (data)->
				deferred.resolve(data)
				GlobalLoading.hide()
			error: (reason)->
				toast.show reason.toString()
				deferred.reject(reason)
				GlobalLoading.hide()
		deferred.promise
	# 通过路径获取文件
	findContentByPath: (path)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'GET'
			url: app.api_domain+'file/findContentByPath'
			data:
				path: path
				time: (new Date()).getTime()
			dataType: 'JSON'
			success: (data)->
				deferred.resolve(data)
				GlobalLoading.hide()
			error: (reason)->
				toast.show reason.toString()
				deferred.reject(reason)
				GlobalLoading.hide()
		deferred.promise
	selects: []
	addSelect: (item)->
		in_array = @selects.some (_item)->
			if item.name==_item.name && item.path==_item.path
				return true
		if !in_array
			@selects.push item
		@active_tab = item.path
		@showInEdit item
	removeSelect: (index)->
		@selects.splice index,1

	showInEdit: (item)->
		unless item.code 
			@findContentByPath item.path
			.then (data)->
				item.code = data.content
				$scope.$apply()
		ext = item.name.split('.')[1]
		item.code_type = @code_types[ext]
		@active_item = item
	save: ()->
		item = @active_item
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'POST'
			url: app.api_domain+'file/save'
			data:
				path: item.path
				content: item.code
				time: (new Date()).getTime()
			dataType: 'JSON'
			success: (data)->
				deferred.resolve(data)
				GlobalLoading.hide()
			error: (reason)->
				toast.show reason.toString()
				deferred.reject(reason)
				GlobalLoading.hide()
		deferred.promise
]