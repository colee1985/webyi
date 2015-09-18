# 功能模型服务
ag.factory 'Action', ['AppConfig', 'toast', 'GlobalLoading', '$rootScope', (app, toast, GlobalLoading, $scope)->
	getParame = ->
		name: ''
		value: ''
		intro: ''
	model = ->
		name: null
		parames: [new getParame()]
		intro: null
		code: null
		test_code: null
		creater_id: null
		app_item_id: null
		plan_status: 'inprogress'

	_models: []
	getParame: getParame
	create: ->
		new model()
	findById: (_id)->
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'GET'
			url: app.api_domain+'action/findById'
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
		ths = @
		GlobalLoading.show()
		Q.all [ app.getLoginerId(), app.getCurAppItemId()]
		.then (res)->
			model.creater_id = res[0]
			model.app_item_id = res[1]
			deferred = Q.defer()
			$.ajax
				type: 'POST'
				url: app.api_domain+'action/save'
				data:
					model: model
					time: (new Date()).getTime()
				dataType: 'JSON'
				success: (data)->
					GlobalLoading.hide()
					return deferred.reject(data) if data.error_code
					unless model._id
						$scope.$apply ->
							ths._models.push data
					deferred.resolve(data)
				error: (reason)->
					GlobalLoading.hide()
					deferred.reject(reason)
			deferred.promise
	del: (_id)->
		ths = @
		GlobalLoading.show()
		deferred = Q.defer()
		$.ajax
			type: 'POST'
			url: app.api_domain+'action/del'
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
				url: app.api_domain+'action/list'
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