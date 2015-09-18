mongoose = require "../utils/mongoose"
model = require '../schemas/ClaimApply'
try
	mongoose.model 'claim_apply', model
catch e
	# ...
module.exports = mongoose.model 'claim_apply'