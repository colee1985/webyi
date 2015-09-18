var Q, mongoose, _EnumItem;

Q = require('q');

mongoose = require("../utils/mongoose");

_EnumItem = require("./_EnumItem");

module.exports = new mongoose.Schema({
  name: {
    type: String,
    "default": null,
    intro: ''
  },
  field_type: {
    type: String,
    "default": null,
    intro: ''
  },
  enums: {
    type: [_EnumItem],
    "default": null,
    intro: ''
  },
  "default": {
    type: String,
    "default": null,
    intro: ''
  },
  intro: {
    type: String,
    "default": null,
    intro: ''
  }
});
