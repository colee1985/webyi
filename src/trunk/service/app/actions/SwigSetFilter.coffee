module.exports = ->
	log4js = require 'log4js'
	Error = require '../utils/Error'
	swig = require 'swig'
	# URL请求类型过滤
	swig.setFilter 'requrlType', (input)->
		str = input.toLowerCase()
		if str!='post' && str!='all'
			return 'get'
		return str
	# 格式化代码缩进
	swig.setFilter 'formatCode', (input, number)->
		t_n = ''
		for i in [1..number]
			t_n += '\t'
		indent = (js) ->
			js.replace /(\\)?\n(?!\n)/g, ($0, $1) ->
				if $1 then $0 else '\n'+t_n
		return indent input
	# 字段类型处理
	swig.setFilter 'fieldType', (input, sub_schema)->
		str = input
		str = 'String' if input=='Email'
		if input=='ObjectId'
			str = 'mongoose.Schema.Types.ObjectId'
		if input=='Mixed'
			str = 'mongoose.Schema.Types.Mixed'
		if str=='Array' && sub_schema && sub_schema.length>0
			str = '['+sub_schema+']'
		if str=='Object' && sub_schema && sub_schema.length>0
			str = sub_schema
		return str
	# 字段取值范围处理
	swig.setFilter 'fieldEnum', (input)->
		if typeof(input)=='object' && input.length>0
			values = []
			for v in input
				values.push v.value
			str = values.join '", "'
			str = '["'+str+'"]'
			return str
		return undefined
	# 功能参数处理
	swig.setFilter 'actionParames', (input)->
		if typeof(input)=='object' && input.length>0
			parames_str = []
			for v in input
				parames_str.push v.name
			return parames_str.join ', '
		return ''

	# 设置默认值
	swig.setFilter 'fieldDefault', (input, value_type)->
		return 'null' unless input
		if value_type=='String' && input.length>0
			return "'"+input+"'"
		else
			return input

	swig.setFilter 'configIsDebug', (input)->
		if input
			return 'true'
		else
			return 'false'
		
	return swig