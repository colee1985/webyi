# URL请求模型服务
ag.factory 'Requrl', ['AppConfig', 'toast', 'GlobalLoading', '$rootScope', (app, toast, GlobalLoading, $scope)->
	request_types = [
		"GET"
		"POST"
		"PUT"
		"PATCH"
		"DELETE"
		"COPY"
		"HEAD"
		"OPTIONS"
		"LINK"
		"UNLINK"
		"PURGE"
		"ALL"
	]
	value_types = [
		'TEXT'
		'EXPRESS'
		'FILE'
	]
	getParame = ->
		name: ''
		value: ''
		value_type: 'TEXT'
		is_require: false
		intro: ''
	model = ->
		title: ''
		path: ''
		type: 'GET'
		intro: ''
		headers: [new getParame()]
		gets: [new getParame()]
		posts: [new getParame()]
		code: ''
		test_code: ''
		creater_id: null
		app_item_id: null
		plan_status: 'inprogress'

	request_types: request_types
	getParame: getParame
	value_types: value_types
	_models: []
	create: ->
		new model()
	findById: (_id)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'GET'
			url: app.api_domain+'requrl/findById'
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
		deferred = Q.defer()
		Q.all [ app.getLoginerId(), app.getCurAppItemId()]
		.then (res)->
			model.creater_id = res[0]
			model.app_item_id = res[1]
			$.ajax
				type: 'POST'
				url: app.api_domain+'requrl/save'
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
			url: app.api_domain+'requrl/del'
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
				url: app.api_domain+'requrl/list'
				data:
					creater_id: creater_id
					app_item_id: app_item_id
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