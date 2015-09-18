mongoose = require "../utils/mongoose"
model = require '../schemas/Landmark'
try
	mongoose.model 'landmark', model
catch e
	# ...
module.exports = mongoose.model 'landmark'