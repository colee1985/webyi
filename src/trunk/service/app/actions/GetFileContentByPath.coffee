# 通过路径获取文件详情
module.exports = (file_path)->
	fs = require 'fs'
	Q = require 'q'
	path = require 'path'
	Q.fcall ->
		deferred = Q.defer()
		fs.readFile file_path, (err, data)->
			if err
				return deferred.reject err
			deferred.resolve data.toString()
		deferred.promise