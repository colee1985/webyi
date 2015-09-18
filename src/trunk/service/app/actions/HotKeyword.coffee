Q = require 'q'
db = require '../utils/MysqlDb'
http = require("http")
buffer = require("buffer")
iconv = require("iconv").Iconv
URL = require("url")
fs = require('fs')

module.exports = ->
	_table_name: 'hot_keywork'
	keywords: []
	ips: []
	getAllKeyword: ->
		thx = @
		db.query('select * from ?? where smt_count<=? limit ?',[@_table_name, 0, 10000])
		.then (rows)->
			for obj in rows
				thx.keywords.push obj.keyword
			return thx.keywords
	getProxyIps: ->
		thx = @
		deferred = Q.defer()
		fs.readFile '../service/build/utils/ProxyIps.txt','utf-8',(err, data)->
			if err
				deferred.reject 'IP文件读取错误'
			else
				res = []
				ips = data.match /([\d\.]+?):(\d+?)@/ig
				for ip in ips
					res.push ip.replace('@','').split(':')
				# console.log res
				thx.ips = res
				deferred.resolve res
		return deferred.promise
	# 运行查询所有关键词的记录量并保存
	run: ->
		thx = @
		Q.all([
			thx.getProxyIps()
			thx.getAllKeyword()
		]).then (res)->
			for i in [0..15] 
				setTimeout ->
					thx._runCirculation()
				,500*i
	# 循环关键词录入
	_runCirculation: ()->
		thx = @
		console.log 'keywords count:',@keywords.length
		if @keywords.length>0
			keyword = @keywords[0]
			thx.keywords.splice 0,1
			thx._saveConutToDb(keyword).then(->
				console.log '处理成功，还有',thx.keywords.length
				thx._runCirculation()
				console.log '继续下一个'
			,(err)->
				console.log '存储失败：',err
				thx.keywords.push keyword
				thx._runCirculation()
				console.log '失败继续下一个'
			)
		else
			console.log '此线程处理完成'
		
	# 通过关键词采集查询总量结果
	getCountByKeyword: (keyword)->
		console.log 'at getCountByKeyword'
		thx = @
		@getHtmlByKeyword(keyword).then (html)->
			html = html.match(/<strong class="search-count">([\s\S]+?)<\/strong>/i)
			unless html[1]
				return thx.getCountByKeyword(keyword)
			number = (html[1]).replace /[^\d\.]/ig,''
			return Number(number)
	# 通过关键词采集页面
	getHtmlByKeyword: (keyword)->
		console.log 'GET HTML'
		thx = @
		
		console.log 'ips:',thx.ips.length
		ip_count = thx.ips.length
		ip_index = Math.floor(Math.random() * ( ip_count + 1))
		ip = thx.ips[ip_index]
		unless ip
			return @getHtmlByKeyword(keyword)
		console.log 'ip:',ip
		deferred = Q.defer()
		url = "http://www.aliexpress.com/wholesale?SearchText="+keyword
		opt = {
			host:ip[0]
			port:ip[1]
			method:'GET'
			# path: url = URL.parse("http://www.aliexpress.com/wholesale?SearchText="+keyword)
			path: url
		}
		req = http.request opt, (res)->
			console.log 'http res:',res.length
			html = ""
			res.setEncoding "binary" #or hex
			res.on "data", (chunk) ->
				# console.log 'http on data:',chunk.length
				html += chunk
			res.on "end", ->
				console.log 'http end:',html.length
				try
					html = (new iconv("GBK", "UTF-8")).convert(new Buffer(html, "binary")).toString()
					console.log 'end html.length',html.length
					deferred.resolve html
				catch exception
					deferred.reject exception
		req.on 'error', (err)->
			console.log '请求异常：',err
			deferred.reject err
		req.end()
		return deferred.promise
	# 结果入库
	_saveConutToDb: (keyword)->
		console.log 'keyword:',keyword
		table_name = @_table_name
		@getCountByKeyword(keyword).then (number)->
			number = 1 if number<1
			db.query('update ?? set smt_count=? where keyword=?', [table_name, number, keyword])
			.then (res)->
				console.log 'update db:',number, keyword,res
				return res 