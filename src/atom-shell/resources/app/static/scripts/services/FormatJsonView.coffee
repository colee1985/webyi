###
JSON格式化与缩进显示
###
app.factory 'FormatJsonView', ()->
	formatJson = (json, options) ->
		reg = null
		formatted = ""
		pad = 0
		PADDING = "    " # one can also use '\t' or a different number of spaces
		
		# optional settings
		options = options or {}
		
		# remove newline where '{' or '[' follows ':'
		options.newlineAfterColonIfBeforeBraceOrBracket = (if (options.newlineAfterColonIfBeforeBraceOrBracket is true) then true else false)
		
		# use a space after a colon
		options.spaceAfterColon = (if (options.spaceAfterColon is false) then false else true)
		
		# begin formatting...
		if typeof json isnt "string"
			
			# make sure we start with the JSON as a string
			json = JSON.stringify(json)
		else
			
			# is already a string, so parse and re-stringify in order to remove extra whitespace
			json = JSON.parse(json)
			json = JSON.stringify(json)
		
		# add newline before and after curly braces
		reg = /([\{\}])/g
		json = json.replace(reg, "\r\n$1\r\n")
		
		# add newline before and after square brackets
		reg = /([\[\]])/g
		json = json.replace(reg, "\r\n$1\r\n")
		
		# add newline after comma
		reg = /(\,)/g
		json = json.replace(reg, "$1\r\n")
		
		# remove multiple newlines
		reg = /(\r\n\r\n)/g
		json = json.replace(reg, "\r\n")
		
		# remove newlines before commas
		reg = /\r\n\,/g
		json = json.replace(reg, ",")
		
		# optional formatting...
		unless options.newlineAfterColonIfBeforeBraceOrBracket
			reg = /\:\r\n\{/g
			json = json.replace(reg, ":{")
			reg = /\:\r\n\[/g
			json = json.replace(reg, ":[")
		if options.spaceAfterColon
			reg = /\:/g
			json = json.replace(reg, ": ")
		$.each json.split("\r\n"), (index, node) ->
			i = 0
			indent = 0
			padding = ""
			if node.match(/\{$/) or node.match(/\[$/)
				indent = 1
			else if node.match(/\}/) or node.match(/\]/)
				pad -= 1  if pad isnt 0
			else
				indent = 0
			i = 0
			while i < pad
				padding += PADDING
				i++
			formatted += padding + node + "\r\n"
			pad += indent

		formatted