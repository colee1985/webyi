var Q, mongoose;

Q = require('q');

mongoose = require("../utils/mongoose");

module.exports = new mongoose.Schema({
  title: {
    type: String,
    "default": null,
    intro: ''
  },
  path: {
    type: String,
    "default": null,
    intro: ''
  },
  type: {
    type: String,
    "default": null,
    intro: ''
  },
  intro: {
    type: String,
    "default": null,
    intro: ''
  },
  headers: {
    type: Array,
    "default": null,
    intro: ''
  },
  gets: {
    type: Array,
    "default": null,
    intro: ''
  },
  posts: {
    type: Array,
    "default": null,
    intro: ''
  },
  code: {
    type: String,
    "default": null,
    intro: ''
  },
  creater_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  app_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    "default": null,
    intro: ''
  },
  plan_status: {
    type: String,
    "default": null,
    intro: ''
  }
});
