# 获取目录下的目录及文件结构
module.exports = (dir_path)->
	fs = require 'fs'
	Q = require 'q'
	path = require 'path'

	deferred = Q.defer()
	fs.readdir dir_path, (err, files)->
		deferred.reject err if err
		items = []
		for item in files
			_path = path.join dir_path, item
			stat = fs.statSync _path
			item = {
	        	name: path.basename(item)
	        	type: 'file'
	        	path: _path
	        	ext: path.extname item
	        }
			if stat.isDirectory(item)
				item.type = 'folder'
			items.push item
		deferred.resolve items
	deferred.promise