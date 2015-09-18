# 保存文件
module.exports = (file_path, content)->
	fs = require 'fs'
	Q = require 'q'
	path = require 'path'
	
	deferred = Q.defer()
	fs.writeFile file_path, content, (err, data)->
		deferred.reject err if err
		deferred.resolve true
	deferred.promise