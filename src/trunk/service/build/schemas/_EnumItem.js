var Q, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

module.exports = new mongoose.Schema({
  value: {
    type: String,
    "default": null,
    intro: ''
  }
});
