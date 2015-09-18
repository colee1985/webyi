AtomCoWebyiView = require './atom-co-webyi-view'
require './jquery-1.8.3'
require './angular.min'

module.exports =
  atomCoWebyiView: null

  activate: (state) ->
    @atomCoWebyiView = new AtomCoWebyiView(state.atomCoWebyiViewState)

  deactivate: ->
    @atomCoWebyiView.destroy()

  serialize: ->
    atomCoWebyiViewState: @atomCoWebyiView.serialize()
