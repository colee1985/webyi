{View} = require 'atom'

module.exports =
class AtomCoWebyiView extends View
  @content: ->
    @div class: 'atom-co-webyi modal fade', =>
      @div "The AtomCoWebyi package is Alive! It's ALIVE!", class: "message"
      @div "来创建个界面", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "atom-co-webyi:toggle", => @toggle()
    atom.workspaceView.command "atom-co-webyi:convert", => @convert()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "AtomCoWebyiView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
  convert: ->
    # This assumes the active pane item is an editor
    editor = atom.workspace.activePaneItem
    editor.insertText('Hello, World!')
