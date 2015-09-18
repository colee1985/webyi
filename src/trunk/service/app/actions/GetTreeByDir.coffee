# 通过目录获取其下目录树
module.exports = (filepath)->
	fs = require("fs")
	path = require("path")

	tree = (filepath) ->
		filepath = path.normalize(filepath)
		stats = fs.lstatSync(filepath)
		result =
			path: filepath
			name: path.basename(filepath)

		if stats.isDirectory()
			result.type = "folder"
			if result.name!="node_modules" && result.name!='vender'
				result.children = fs.readdirSync(filepath).map((child) ->
					tree filepath + "/" + child
				)
		else
			result.type = "file"
		result
	tree filepath