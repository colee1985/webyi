mongoose = require "../utils/mongoose"
model = require '../schemas/EnshrineLeaflet'
try
	mongoose.model 'enshrine_leaflet', model
catch e
	# ...
module.exports = mongoose.model 'enshrine_leaflet'