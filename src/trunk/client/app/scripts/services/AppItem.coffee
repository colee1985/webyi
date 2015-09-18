# 服务端创建的应用配置服务
ag.factory 'AppItem', ['AppConfig', 'toast', 'GlobalLoading', '$rootScope', (app, toast, GlobalLoading, $scope)->
	model = ->
		name: ''
		debug: true
		server_port: 1080
		db_host: '127.0.0.1'
		db_port: 27017
		db_name: ''
		db_username: 'root'
		db_password: ''
		other_conf: ''

	models: []
	create: ->
		new model()
	findById: (_id)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'GET'
			url: app.api_domain+'appitem/findById'
			data:
				_id: _id
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
	save: (model)->
		GlobalLoading.show()
		Q.all [ app.getLoginerId(), app.getCurAppItemId()]
		.then (res)->
			model.creater_id = res[0]
			deferred = Q.defer()
			$.ajax
				type: 'POST'
				url: app.api_domain+'appitem/save'
				data:
					model: model
					time: (new Date()).getTime()
				dataType: 'JSON'
				success: (data)->
					deferred.resolve(data)
					GlobalLoading.hide()
				error: (reason)->
					deferred.reject(reason)
					GlobalLoading.hide()
			deferred.promise
	del: (_id)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'POST'
			url: app.api_domain+'appitem/del'
			data:
				_id: _id
				time: (new Date()).getTime()
			dataType: 'JSON'
			success: (data)->
				deferred.resolve(data)
				GlobalLoading.hide()
			error: (reason)->
				deferred.reject(reason)
				GlobalLoading.hide()
		deferred.promise
	delByIndex: (index)->
		ths = @
		model = @_models[index]
		@del model._id
		.then (res)->
			$scope.$apply ->
				ths._models.splice index,1
	getList: ()->
		ths = @
		GlobalLoading.show()
		Q.all [ app.getLoginerId(), app.getCurAppItemId()]
		.then (res)->
			creater_id = res[0]
			app_item_id = res[1]
			deferred = Q.defer()
			$.ajax
				type: 'GET'
				url: app.api_domain+'appitem/list'
				data:
					creater_id: creater_id
					time: (new Date()).getTime()
				dataType: 'JSON'
				success: (data)->
					ths._models = data
					deferred.resolve(data)
					GlobalLoading.hide()
				error: (reason)->
					deferred.reject(reason)
					GlobalLoading.hide()
			deferred.promise
]