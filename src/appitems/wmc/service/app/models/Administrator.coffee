mongoose = require "../utils/mongoose"
model = require '../schemas/Administrator'
try
	mongoose.model 'administrator', model
catch e
	# ...
module.exports = mongoose.model 'administrator'